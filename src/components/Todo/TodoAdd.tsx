// Imports
import React, { useEffect, useState } from 'react';
import { addTodos } from '../../features/todos/todosSlice';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import getStatus from '../../utils/commons';

// MUI
import {
	Box,
	Typography,
	TextField,
	Button,
	FormControl,
	Select,
	SelectChangeEvent,
	MenuItem,
	InputLabel,
} from '@mui/material';

// Interfaces
import { Status, SelectValuesInterface } from '../../utils/types';

// Component
function TodoAdd() {
	// States
	const [inputValue, setInputValue] = useState<string>('');
	const [selectValues, setSelectValues] = useState<SelectValuesInterface>({
		categoryId: 0,
		statusId: 0,
	});
	const [statusList, setStatusList] = useState<Status[]>([]);
	const categories = useAppSelector((state) => state.categories.data);

	// Variables
	const dispatch = useAppDispatch();

	// useEffect
	// Category degistiginde secilen categorye ait api'dan status cekiliyor
	useEffect(() => {
		if (selectValues['categoryId']) {
			getStatus({
				categoryId: selectValues['categoryId'],
			}).then((response: any) => {
				setStatusList(response);
			});
		}
	}, [selectValues['categoryId']]);

	// handle Input change
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
	}

	// Handle Todo Submit
	function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		// Todo verisi dispatch uzerinden api'ye gonderiliyor
		dispatch(
			addTodos({
				title: inputValue,
				categoryId: selectValues['categoryId'],
				statusId: selectValues['statusId'],
			})
		);

		// Input degerleri temizleniyor
		setInputValue('');
		setSelectValues({
			categoryId: 0,
			statusId: 0,
		});
	}

	// Return Element
	return (
		<Box component="div" sx={{ width: '100%', mb: 10 }}>
			<Typography component="h2" fontSize="1.6rem" m={1} gutterBottom>
				Todo Ekle
			</Typography>
			<form autoComplete="off" onSubmit={handleSubmit}>
				<TextField
					sx={{ width: '60ch', m: 1 }}
					id="todoInput"
					name="todoInput"
					label="Todo Metni"
					placeholder="Todo Metni"
					value={inputValue}
					onChange={handleInputChange}
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
						{categories.map((category) => {
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
						{statusList &&
							statusList.map((status) => (
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
					sx={{ width: '25ch', ml: 1, mr: 1, fontSize: '1rem' }}
					type="submit"
					variant="contained"
					disabled={!selectValues['categoryId'] || !selectValues['statusId']}
				>
					Ekle
				</Button>
			</form>
		</Box>
	);
}

export default TodoAdd;
