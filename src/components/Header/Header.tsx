// Imports
import React from 'react';
import { logoutTodos } from '../../features/todos/todosSlice';
import { logoutCategories } from '../../features/categories/categoriesSlice';
import { useAppDispatch } from '../../utils/hooks';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

function Header() {
	// variables
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	// Functions
	// Handle Logout
	function handleLogoutClick() {
		deleteToken();
		dispatch(logoutTodos());
		dispatch(logoutCategories());
		navigate('/login');
	}

	// Delete token
	function deleteToken(): void {
		// Token cookie'si siliniyor
		document.cookie = 'token=; Max-Age=-99999999;';
	}

	// Element
	return (
		<Box
			component="header"
			sx={{
				borderBottom: 1,
				padding: 3,
			}}
		>
			<Grid container spacing={2}>
				<Grid item xs={2}>
					<>
						{location.pathname !== '/' &&
							location.pathname !== '/categories' &&
							location.pathname !== '/login' && (
								<Button
									component={RouterLink}
									to={'/categories'}
									variant="outlined"
								>
									Kategoriler Sayfasina Don
								</Button>
							)}

						{location.pathname === '/categories' && (
							<Button component={RouterLink} to={'/'} variant="outlined">
								Todo Sayfasina Don
							</Button>
						)}
					</>
				</Grid>
				<Grid item xs={8}>
					<Typography
						variant="h1"
						component="h1"
						fontSize="2rem"
						textAlign="center"
						m={0}
					>
						TodoList App
					</Typography>
				</Grid>
				<Grid
					item
					xs={2}
					sx={{
						textAlign: 'right',
					}}
				>
					{location.pathname !== '/login' && (
						<Button variant="contained" onClick={handleLogoutClick}>
							Logout
						</Button>
					)}
				</Grid>
			</Grid>
		</Box>
	);
}

export default Header;
