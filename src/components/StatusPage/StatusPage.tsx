// Imports
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../utils/hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { service } from '../../utils/service';
import getStatus from '../../utils/commons';

// MUI
import {
	Box,
	Typography,
	Button,
	List,
	ListItem,
	TextField,
	Grid,
} from '@mui/material';

// interface
import { Status } from '../../utils/types';

function StatusPage() {
	const [statusList, setStatusList] = useState<Status[]>([]);
	const { categoryId } = useParams();
	const navigate = useNavigate();
	const category = useAppSelector((state) => {
		if (categoryId) {
			return state.categories.data.find(
				(category) => category.id === parseInt(categoryId)
			);
		} else {
			return undefined;
		}
	});

	// Ilk yukleme
	useEffect(() => {
		if (category && categoryId) {
			// API call
			getStatus({
				categoryId: parseInt(categoryId),
			}).then((response: any) => {
				setStatusList(response);
			});
		} else {
			navigate('/categories');
		}
	}, [category]);

	// // Handle Statu Submit
	function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		const { newStatusInput, newColorInput } = event.currentTarget;

		// Todo verisi onSubmit uzerinden App component'ine gonderiliyor
		// Sunucuya yeni statu eklenmesi icin request gonderiliyor.
		service
			.post('/status', {
				title: newStatusInput.value,
				categoryId: category?.id,
				color: newColorInput.value,
			})
			.then((response) => {
				if (response.status === 200) {
					setStatusList((prev) => [...prev, response.data]);
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});

		// Input degerleri temizleniyor
		newStatusInput.value = '';
		newColorInput.value = '';
	}

	// Handle Statu Update
	function handleStatusUpdateSubmit(
		event: React.FormEvent<HTMLFormElement>,
		statusId: number
	) {
		// Formun varsayilan aksiyonu durduruluyor
		event.preventDefault();

		// Input bir degiskene ataniyor
		const { statusTitleInput, colorInput } = event.currentTarget;

		// API call
		service
			.put(`/status/${statusId}`, {
				title: statusTitleInput.value,
				categoryId: category?.id,
				color: colorInput.value,
			})
			.then((response) => {
				if (response.status === 200) {
					const index = statusList.findIndex((item) => item.id === statusId);

					setStatusList([
						...statusList.slice(0, index),
						response.data,
						...statusList.slice(index + 1),
					]);
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	// // Handle Delete Status
	function handleDeleteStatus(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		statusId: number
	): void {
		// Formun Submit'ini tetiklemesi engelleniyor
		event.stopPropagation();

		// API call
		service
			.delete(`/status/${statusId}`)
			.then((response) => {
				if (response.status === 200) {
					const index = statusList.findIndex((item) => item.id === statusId);

					setStatusList([
						...statusList.slice(0, index),
						...statusList.slice(index + 1),
					]);
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	return (
		<Box
			sx={{
				maxWidth: '100%',
				width: '100%',
				p: 2,
				mt: 2,
				mb: 2,
				boxSizing: 'border-box',
			}}
		>
			<Grid container spacing={2} direction="row" justifyContent="center">
				<Grid item xs={2}></Grid>
				<Grid sx={{ display: 'flex', flexWrap: 'wrap' }} item xs={8}>
					<Typography component="h2" fontSize="1.6rem" m={1} gutterBottom>
						Statu Duzenle
					</Typography>

					<Box component="div" sx={{ width: '100%', mb: 10 }}>
						<Typography component="h3" fontSize="1.2rem" m={1} gutterBottom>
							Duzenlenen Kategori: {category?.title}
						</Typography>
						<form autoComplete="off" onSubmit={handleSubmit}>
							<TextField
								sx={{ width: '50ch', m: 1 }}
								id="newStatusInput"
								name="newStatusInput"
								label="Statu Adi"
								placeholder="Statu Adi"
								required
							/>
							<TextField
								sx={{ width: '15ch', m: 1 }}
								inputProps={{ pattern: '[a-zA-Z]*', maxLength: 6 }}
								id="newColorInput"
								name="newColorInput"
								label="Renk Ismi"
								placeholder="Renk Ismi"
								required
							/>
							<br />
							<Button sx={{ ml: 1, mr: 1 }} type="submit" variant="contained">
								Ekle
							</Button>
						</form>
					</Box>

					<Box component="div" sx={{ width: '100%', mb: 10 }}>
						<Typography component="h3" fontSize="1.2rem" m={1} gutterBottom>
							Statu Listesi
						</Typography>

						<List sx={{ width: '100%', m: 0 }}>
							{category &&
								statusList.map((status) => (
									<ListItem key={status.id}>
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
											onSubmit={(event: any) =>
												handleStatusUpdateSubmit(event, status.id)
											}
										>
											<div
												style={{
													backgroundColor: status.color,
													width: '20px',
													height: '20px',
													marginRight: '20px',
													borderRadius: '50%',
												}}
											></div>
											<TextField
												sx={{ width: '50ch', mr: 5 }}
												name="statusTitleInput"
												label="Statu Adi"
												placeholder="Statu Adi"
												variant="standard"
												required
												defaultValue={status.title}
											/>

											<TextField
												sx={{ width: '25ch', mr: 5 }}
												inputProps={{ pattern: '[a-zA-Z]*' }}
												name="colorInput"
												label="Statu Renk Adi"
												placeholder="Statu Renk Adi"
												variant="standard"
												required
												defaultValue={status.color}
											/>

											<Button type="submit" variant="contained" sx={{ mr: 1 }}>
												Guncelle
											</Button>

											<Button
												type="button"
												variant="outlined"
												onClick={(event) =>
													handleDeleteStatus(event, status.id)
												}
											>
												Sil
											</Button>
										</Box>
									</ListItem>
								))}
						</List>
					</Box>
				</Grid>
				<Grid item xs={2}></Grid>
			</Grid>
		</Box>
	);
}

export default StatusPage;
