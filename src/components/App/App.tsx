// Imports
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import { fetchTodos } from '../../features/todos/todosSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import { Link as RouterLink } from 'react-router-dom';

// API
import { service } from '../../utils/service';

// Components
import Filter from '../Filter/Filter';
import TodoAdd from '../Todo/TodoAdd';
import TodoItem from '../Todo/TodoItem';

// MUI
import {
	Box,
	Grid,
	List,
	Alert,
	CircularProgress,
	Button,
} from '@mui/material';

// Types
import { TodoInterface } from '../../utils/types';

function App() {
	// STATES
	const [token, setToken] = useState<string>(() => getCookie('token') || '');
	const [todoList, setTodoList] = useState<TodoInterface[]>([]);

	// variables
	const todos = useAppSelector((state) => {
		const { categoryId, statusId } = state.todos.filter;
		if (!categoryId && !statusId) return state.todos.data;

		return state.todos.data.filter(
			(item) => item.categoryId === categoryId && item.statusId === statusId
		);
	});
	const categories = useAppSelector((state) => state.categories.data);
	const apiStatus = useAppSelector((state) => state.todos.apiStatus);
	const apiError = useAppSelector((state) => state.todos.apiError);
	const dispatch = useAppDispatch();
	let content: any = '';

	// useEffect
	// get todos and categories
	useEffect(() => {
		const token = getCookie('token');

		if (token && apiStatus === 'idle') {
			service.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			dispatch(fetchTodos());
			dispatch(fetchCategories());
		} else if (!token) {
			service.defaults.headers.common['Authorization'] = '';
		}
	}, [token, apiStatus, dispatch]);

	// Content
	if (apiStatus === 'loading') {
		content = <CircularProgress />;
	} else if (apiStatus === 'succeeded') {
		content = (
			<>
				<TodoAdd />

				<Filter />

				<List sx={{ width: '100%' }}>
					{todos.map((todo) => (
						<TodoItem key={todo.id} todoItem={todo} categoryList={categories} />
					))}
				</List>

				<Button component={RouterLink} to="/categories" variant="contained">
					Kategorileri duzenle
				</Button>
			</>
		);
	} else if (apiStatus === 'failed') {
		content = <Alert severity="error">{apiError}</Alert>;
	}

	// FUNCTIONS
	// Get Cookie
	function getCookie(cname: string): string {
		let name = cname + '=';
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}

	return (
		<Box
			sx={{
				maxWidth: '100%',
				width: '100%',
				p: 2,
				boxSizing: 'border-box',
				mt: 2,
				mb: 2,
			}}
		>
			<Grid container spacing={2} direction="row" justifyContent="center">
				<Grid item xs={2}></Grid>
				<Grid sx={{ display: 'flex', flexWrap: 'wrap' }} item xs={8}>
					{content}
				</Grid>
				<Grid item xs={2}></Grid>
			</Grid>
		</Box>
	);
}

export default App;
