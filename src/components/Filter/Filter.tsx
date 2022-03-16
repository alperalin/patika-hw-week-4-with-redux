import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import { filterTodos } from '../../features/todos/todosSlice';
import getStatus from '../../utils/commons';

// MUI
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	Select,
	SelectChangeEvent,
	Typography,
	MenuItem,
} from '@mui/material';

// Interfaces
import { SelectValuesInterface, Status } from '../../utils/types';

function Filter() {
	// States
	const [selectValues, setSelectValues] = useState<SelectValuesInterface>({
		categoryId: 0,
		statusId: 0,
	});
	const [statusList, setStatusList] = useState<Status[]>([]);

	// variables
	const categories = useAppSelector((state) => state.categories.data);
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

	// Functions
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
		// Formun varsayilan islevi durduruluyor
		event.preventDefault();

		// dispatch ile filter degerleri gonderiliyor
		dispatch(
			filterTodos({
				categoryId: selectValues.categoryId,
				statusId: selectValues.statusId,
			})
		);
	}

	function handleClear(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	): void {
		// Butonun formu tetiklemesi engelleniyor
		event.stopPropagation();

		// dispatch ile filter temizleniyor
		dispatch(
			filterTodos({
				categoryId: null,
				statusId: null,
			})
		);

		// select'ler sifirlaniyor
		setSelectValues({
			categoryId: 0,
			statusId: 0,
		});
	}

	return (
		<Box component="div" sx={{ width: '100%', mb: 2 }}>
			<Typography component="h2" fontSize="1.6rem" gutterBottom>
				Todo Listesi
			</Typography>
			<Box
				component="form"
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					width: '100%',
					mb: 2,
				}}
				autoComplete="off"
				onSubmit={handleSubmit}
			>
				<Typography
					sx={{ width: '10ch', mr: 1 }}
					component="h3"
					fontSize="1.2rem"
					gutterBottom
				>
					Filtrele
				</Typography>

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
					sx={{ mr: 1 }}
					type="submit"
					variant="contained"
					disabled={!selectValues['categoryId'] || !selectValues['statusId']}
				>
					Filtrele
				</Button>
				<Button type="button" variant="outlined" onClick={handleClear}>
					Filtreyi Sil
				</Button>
			</Box>
		</Box>
	);
}

export default Filter;
