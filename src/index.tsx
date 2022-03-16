import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import store from './features/app/store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './components/App/App';
import Header from './components/Header/Header';
import LoginRegister from './components/Login/LoginRegister';
import CategoryPage from './components/CategoryPage/CategoryPage';
import StatusPage from './components/StatusPage/StatusPage';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/login" element={<LoginRegister />} />
					<Route path="/categories" element={<CategoryPage />} />
					<Route path="/categories/:categoryId" element={<StatusPage />} />
				</Routes>
			</Router>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
