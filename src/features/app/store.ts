import { configureStore } from '@reduxjs/toolkit';

// Reducers
import todosReducer from '../todos/todosSlice';
import categoriesReducer from '../categories/categoriesSlice';

// Store
const store = configureStore({
	reducer: {
		todos: todosReducer,
		categories: categoriesReducer,
	},
});

// export Store
export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: { todos: todosState }
export type AppDispatch = typeof store.dispatch;
