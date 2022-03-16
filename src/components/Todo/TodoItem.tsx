// Imports
import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../utils/hooks';
import { updateTodos, deleteTodos } from '../../features/todos/todosSlice';
import getStatus from '../../utils/commons';

// MUI
import {
	ListItem,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
	Button,
	TextField,
} from '@mui/material';

// Interface
import {
	TodoInterface,
	CategoryInterface,
	Status,
	SelectValuesInterface,
} from '../../utils/types';

interface TodoListProps {
	todoItem: TodoInterface;
	categoryList: CategoryInterface[];
}

function TodoItem({ todoItem, categoryList }: TodoListProps) {
	//States
	const [inputValue, setInputValue] = useState<string>('');
	const [selectValues, setSelectValues] = useState<SelectValuesInterface>({
		categoryId: 0,
		statusId: 0,
	});
	const [statusList, setStatusList] = useState<Status[]>([]);
	const [statusColor, setStatusColor] = useState<string>('');

	// variables
	const dispatch = useAppDispatch();

	// useEffect
	// Ilk yuklenmede category ve status belirleniyor
	useEffect(() => {
		setSelectValues((prev) => ({
			...prev,
			categoryId: todoItem.categoryId,
			statusId: todoItem.statusId || 0,
		}));
		getStatus({ categoryId: todoItem.categoryId });
		setInputValue(todoItem.title);
	}, []);

	// Category degistiginde secilen kategoriye ait api'dan status cekiliyor
	useEffect(() => {
		if (selectValues['categoryId']) {
			getStatus({
				categoryId: selectValues['categoryId'],
			}).then((response: any) => {
				setStatusList(response);
			});
		}
	}, [selectValues['categoryId']]);

	// Get Status color
	useEffect(() => {
		const status: Status | undefined = statusList.find(
			(status) => status.id === todoItem.statusId
		);

		if (status) setStatusColor(status.color);
	}, [todoItem.statusId, statusList]);

	// Handle input change
	function handleInputChange(
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) {
		setInputValue(event.target.value);
	}

	// Select change
	function handleSelectChange(event: SelectChangeEvent) {
		const { name, value } = event.target;

		setSelectValues((prev) => ({
			...prev,
			[name]: parseInt(value),
		}));

		if (name === 'categoryId') {
			setSelectValues((prev) => ({
				...prev,
				statusId: 0,
			}));
		}
	}

	// Handle Todo Update
	function handleUpdate(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		todo: TodoInterface
	): void {
		event.preventDefault();

		// Todo verisi dispatch uzerinden guncellenmesi api'ye gonderiliyor
		dispatch(
			updateTodos({
				id: todo.id,
				title: inputValue,
				categoryId: selectValues['categoryId'],
				statusId: selectValues['statusId'],
			})
		);
	}

	// Handle Delete
	function handleDelete(todo: TodoInterface) {
		// Todo verisi dispatch uzerinden silinmesi api'ye gonderiliyor
		dispatch(
			deleteTodos({
				id: todo.id,
			})
		);
	}

	return (
		<>
			<ListItem sx={{ flexWrap: 'wrap', mt: 2, mb: 2 }} key={todoItem.id}>
				<div
					style={{
						backgroundColor: statusColor,
						width: '20px',
						height: '20px',
						marginRight: '20px',
						borderRadius: '50%',
					}}
				></div>

				<TextField
					sx={{ width: '50ch', mr: 3 }}
					id="todoInput"
					name="todoInput"
					label="Todo Metni"
					placeholder="Todo Metni"
					value={inputValue}
					onChange={handleInputChange}
					variant="standard"
					required
				/>
				<FormControl required sx={{ m: 1, width: '20ch' }}>
					<InputLabel id="category-select">Kategori</InputLabel>
					<Select
						labelId="category-select"
						label="Kategori"
						name="categoryId"
						onChange={handleSelectChange}
						value={selectValues['categoryId'].toString()}
					>
						<MenuItem key={`categoryId_${0}`} value={0}>
							None
						</MenuItem>
						{categoryList &&
							categoryList.map((category) => {
								return (
									<MenuItem
										key={`categoryId_${category.id.toString()}`}
										value={category.id.toString()}
									>
										{category.title}
									</MenuItem>
								);
							})}
					</Select>
				</FormControl>
				<FormControl required sx={{ m: 1, width: '20ch' }}>
					<InputLabel id="statu-select">Statu</InputLabel>
					<Select
						labelId="status-select"
						label="Statu"
						name="statusId"
						onChange={handleSelectChange}
						value={selectValues['statusId'].toString()}
					>
						<MenuItem key={`statusId_${0}`} value={0}>
							None
						</MenuItem>
						{statusList.map((status) => (
							<MenuItem
								key={`statusId_${status.id.toString()}`}
								value={status.id.toString()}
							>
								{status.title}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Button
					type="button"
					variant="contained"
					sx={{ mr: 1 }}
					disabled={
						!selectValues['categoryId'] ||
						!selectValues['statusId'] ||
						!inputValue
					}
					onClick={(event) => handleUpdate(event, todoItem)}
				>
					Guncelle
				</Button>
				<Button
					type="button"
					variant="outlined"
					onClick={() => handleDelete(todoItem)}
				>
					Sil
				</Button>
			</ListItem>
		</>
	);
}

export default TodoItem;
