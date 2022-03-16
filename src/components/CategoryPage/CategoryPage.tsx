// Imports
import React, { FormEvent, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../utils/hooks';
import {
	fetchCategories,
	addCategory,
	updateCategory,
	deleteCategory,
} from '../../features/categories/categoriesSlice';
import { Link as RouterLink } from 'react-router-dom';

// API
import { service } from '../../utils/service';

// MUI
import {
	Box,
	Typography,
	Button,
	List,
	ListItem,
	TextField,
	Grid,
	CircularProgress,
	Alert,
} from '@mui/material';

function CategoryPage() {
	// Variables
	const categories = useAppSelector((state) => state.categories.data);
	const apiStatus = useAppSelector((state) => state.categories.apiStatus);
	const apiError = useAppSelector((state) => state.categories.apiError);
	const dispatch = useAppDispatch();
	let content: any = '';

	// Api donusune gore kategoriler cekiliyor.
	useEffect(() => {
		if (apiStatus === 'idle') {
			const token = getCookie('token');
			service.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			dispatch(fetchCategories());
		}
	}, [dispatch, apiStatus]);

	// Functions
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

	// Handle New Category
	function handleNewCategorySubmit(event: React.FormEvent<HTMLFormElement>) {
		// Formun varsayilan aksiyonu durduruluyor
		event.preventDefault();

		// Input bir degiskene ataniyor
		const { newCategoryInput } = event.currentTarget;

		// Input degeri yeni kategori olusturulmasi icin App component'ine gonderiliyor
		// onNewCategorySubmit({ title: newCategoryTitle.value });
		dispatch(addCategory({ title: newCategoryInput.value }));

		// Input temizleniyor
		newCategoryInput.value = '';
	}

	// Handle Category Update
	function handleCategoryUpdateSubmit(
		event: React.FormEvent<HTMLFormElement>,
		id: number
	) {
		// Formun varsayilan aksiyonu durduruluyor
		event.preventDefault();

		// // Input bir degiskene ataniyor
		const { categoryInput } = event.currentTarget;

		// Kategorinin guncellenmesi icin dispatch ediliyor
		dispatch(updateCategory({ id, title: categoryInput.value }));
	}

	// Handle Category Delete
	function handleDeleteCategorySubmit(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		id: number
	) {
		// Formun Submit'ini tetiklemesi engelleniyor
		event.stopPropagation();

		// Category id, kategorinin silinmesi icin dispatch ediliyor
		dispatch(deleteCategory({ id }));
	}

	// Content
	if (apiStatus === 'loading') {
		content = <CircularProgress />;
	} else if (apiStatus === 'succeeded') {
		content = (
			<Grid sx={{ display: 'flex', flexWrap: 'wrap' }} item xs={8}>
				<Typography component="h2" fontSize="1.6rem" m={1} gutterBottom>
					Kategorileri Duzenle
				</Typography>
				<Box component="div" sx={{ width: '100%', mb: 5 }}>
					<Typography component="h3" fontSize="1.2rem" m={1} gutterBottom>
						Kategori Ekle
					</Typography>

					<Box
						component="form"
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							alignItems: 'center',
							width: '100%',
						}}
						autoComplete="off"
						onSubmit={handleNewCategorySubmit}
					>
						<TextField
							sx={{ width: '50ch', m: 1 }}
							id="newCategoryInput"
							name="newCategoryInput"
							label="Yeni Kategori Adi"
							placeholder="Yeni Kategori Adi"
							required
						/>
						<Button sx={{ ml: 1, mr: 1 }} type="submit" variant="contained">
							Kategori Ekle
						</Button>
					</Box>
				</Box>

				<Box component="div" sx={{ width: '100%', mb: 5 }}>
					<Typography component="h2" fontSize="1.6rem" m={1} gutterBottom>
						Kategorileri Listesi
					</Typography>

					<List sx={{ width: '100%' }}>
						{categories.map((category) => (
							<ListItem key={category.id}>
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
									onSubmit={(event: FormEvent<HTMLFormElement>) =>
										handleCategoryUpdateSubmit(event, category.id)
									}
								>
									<TextField
										sx={{ width: '50ch', mr: 5 }}
										id={category.id.toString()}
										name="categoryInput"
										label="Kategori Adi"
										placeholder="Kategori Adi"
										variant="standard"
										required
										defaultValue={category.title}
									/>

									<Button type="submit" variant="contained" sx={{ mr: 1 }}>
										Guncelle
									</Button>
									<Button
										type="button"
										component={RouterLink}
										to={`/categories/${category.id}`}
										sx={{ mr: 1 }}
										variant="contained"
										color="secondary"
									>
										Statuler Duzenle
									</Button>
									<Button
										type="button"
										variant="outlined"
										onClick={(event) =>
											handleDeleteCategorySubmit(event, category.id)
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
		);
	} else if (apiStatus === 'failed') {
		content = <Alert severity="error">{apiError}</Alert>;
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
				{content}
				<Grid item xs={2}></Grid>
			</Grid>
		</Box>
	);
}

export default CategoryPage;
