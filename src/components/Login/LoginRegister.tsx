// Imports
import React, { useState } from 'react';
import { service } from '../../utils/service';
import { useNavigate } from 'react-router-dom';

// MUIs
import { Box, Tabs, Tab, TextField, Button } from '@mui/material';

// Interfaces
interface FormValuesInterface {
	username: string;
	password: string;
	passwordConfirm?: string;
}

// FOR MUI
interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Box>{children}</Box>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

// LoginRegister Component
function LoginRegister() {
	// States
	const [formValues, setFormValues] = useState<FormValuesInterface>({
		username: '',
		password: '',
		passwordConfirm: '',
	});
	const [tabValue, setTabValue] = useState(0);

	// variables
	const navigate = useNavigate();

	// Functions
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);

		setFormValues({
			username: '',
			password: '',
			passwordConfirm: '',
		});
	};

	// handle Inputs
	function handleInput(
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) {
		const { name, value } = event.target;

		setFormValues((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	// Handle Login
	function handleLogin(event: React.FormEvent<HTMLFormElement>) {
		// Form'un default aksiyonu engelleniyor.
		event.preventDefault();

		// Input degerleri aliniyor
		const { username, password } = event.currentTarget;

		// API call
		service
			.post('/auth/login', {
				username: username.value,
				password: password.value,
			})
			.then((response) => {
				if (response.status === 200) {
					// Diger api cagrilarinda kullanilmasi icin
					// sunucunun dondugu token degeri
					// axios'un defaults degerlerine ekleniyor.
					const token: string = response.data.token;
					service.defaults.headers.common['Authorization'] = `Bearer ${token}`;

					// Token cookie'ye kayit ediliyor.
					document.cookie = `token=${token}`;

					// redirect to app
					navigate('/');
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	// Handle Register
	function handleRegister(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		// API call
		// Input degerleri aliniyor
		const { username, password, passwordConfirm } = event.currentTarget;

		// API call
		service
			.post('/auth/register', {
				username: username.value,
				password: password.value,
				passwordConfirm: passwordConfirm.value,
			})
			.then((response) => {
				if (response.status === 200) {
					// Diger api cagrilarinda kullanilmasi icin
					// sunucunun dondugu token degeri
					// axios'un defaults degerlerine ekleniyor.
					const token: string = response.data.token;
					service.defaults.headers.common['Authorization'] = `Bearer ${token}`;

					// Token cookie'ye kayit ediliyor.
					document.cookie = `token=${token}`;

					// redirect to app
					navigate('/');
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	// Element
	return (
		<Box
			sx={{
				maxWidth: 800,
				width: '100%',
				p: 2,
				m: '0 auto',
				boxSizing: 'border-box',
			}}
		>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					aria-label="Login/Register Page"
					centered
				>
					<Tab label="Login" {...a11yProps(0)} />
					<Tab label="Register" {...a11yProps(1)} />
				</Tabs>
			</Box>
			<TabPanel value={tabValue} index={0}>
				<form
					autoComplete="off"
					onSubmit={handleLogin}
					style={{ maxWidth: 400, margin: '0 auto' }}
				>
					<TextField
						sx={{ display: 'flex', width: '100%', mb: 1 }}
						name="username"
						label="Kullanici Ismi"
						placeholder="Kullanici Ismi"
						onChange={handleInput}
						value={formValues['username']}
						required
					/>
					<TextField
						sx={{ display: 'flex', width: '100%', mb: 1 }}
						name="password"
						label="Sifre"
						type="password"
						placeholder="Sifre"
						autoComplete="off"
						onChange={handleInput}
						value={formValues['password']}
						required
					/>
					<Button type="submit" variant="contained">
						Giris Yap
					</Button>
				</form>
			</TabPanel>
			<TabPanel value={tabValue} index={1}>
				<form
					autoComplete="off"
					onSubmit={handleRegister}
					style={{ maxWidth: 400, margin: '0 auto' }}
				>
					<TextField
						sx={{ display: 'flex', width: '100%', mb: 1 }}
						name="username"
						label="Kullanici Ismi"
						placeholder="Kullanici Ismi"
						onChange={handleInput}
						value={formValues['username']}
						required
					/>
					<TextField
						sx={{ display: 'flex', width: '100%', mb: 1 }}
						name="password"
						label="Sifre"
						type="password"
						placeholder="Sifre"
						autoComplete="off"
						onChange={handleInput}
						value={formValues['password']}
						required
					/>
					<TextField
						sx={{ display: 'flex', width: '100%', mb: 1 }}
						name="passwordConfirm"
						label="Sifre Tekrari"
						type="password"
						placeholder="Sifre Tekrari"
						autoComplete="off"
						onChange={handleInput}
						value={formValues['passwordConfirm']}
						required
					/>
					<Button type="submit" variant="contained">
						Kayit Ol
					</Button>
				</form>
			</TabPanel>
		</Box>
	);
}

export default LoginRegister;
