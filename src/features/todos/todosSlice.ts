import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { service } from '../../utils/service';

// interface
import {
	ReduxTodoStateInterface,
	TodoAddInterface,
	TodoUpdateInterface,
	TodoDeleteInterface,
} from '../../utils/types';

// Initial State
const initialState: ReduxTodoStateInterface = {
	data: [],
	filter: {
		categoryId: null,
		statusId: null,
	},
	apiStatus: 'idle',
	apiError: null,
};

// Redux Slice for todos
const todosSlice = createSlice({
	name: 'todos',
	initialState,
	reducers: {
		logoutTodos() {
			return initialState;
		},
		filterTodos(state, action: PayloadAction<any>) {
			state.filter = {
				...action.payload,
			};
		},
	},
	extraReducers(builder) {
		builder
			.addCase(fetchTodos.pending, (state, action) => {
				state.apiStatus = 'loading';
			})
			.addCase(fetchTodos.fulfilled, (state, action) => {
				state.apiStatus = 'succeeded';
				state.data = state.data.concat(action.payload);
			})
			.addCase(fetchTodos.rejected, (state, action) => {
				state.apiStatus = 'failed';
				state.apiError = action.error.message || null;
			});

		builder.addCase(addTodos.fulfilled, (state, action) => {
			state.data.push(action.payload);
		});

		builder.addCase(updateTodos.fulfilled, (state, action) => {
			const { id } = action.payload;
			const index = state.data.findIndex((item) => item.id === id);

			state.data = [
				...state.data.slice(0, index),
				action.payload,
				...state.data.slice(index + 1),
			];
		});

		builder.addCase(deleteTodos.fulfilled, (state, action) => {
			const { id } = action.payload;
			const index = state.data.findIndex((item) => item.id === id);

			state.data = [
				...state.data.slice(0, index),
				...state.data.slice(index + 1),
			];
		});
	},
});

// Redux Thunk for fetching todos from api
const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
	// API call
	return await service.get('/todo').then((response) => response.data);
});

const addTodos = createAsyncThunk(
	'todos/addTodos',
	async ({ title, categoryId, statusId }: TodoAddInterface) => {
		// API call
		return await service
			.post('/todo', { title, categoryId, statusId })
			.then((response) => response.data);
	}
);

const updateTodos = createAsyncThunk(
	'todos/updateTodos',
	async ({ id, title, categoryId, statusId }: TodoUpdateInterface) => {
		// API call
		return await service
			.put(`/todo/${id}`, { title, categoryId, statusId })
			.then((response) => response.data);
	}
);

const deleteTodos = createAsyncThunk(
	'todos/deleteTodos',
	async ({ id }: TodoDeleteInterface) => {
		// API call
		return await service
			.delete(`/todo/${id}`)
			.then((response) => ({ id, data: response.data }));
	}
);

// Export Actions
const { logoutTodos, filterTodos } = todosSlice.actions;

// Exports
export {
	logoutTodos,
	filterTodos,
	fetchTodos,
	addTodos,
	updateTodos,
	deleteTodos,
};

// Export todosSlice Recuder as Default
export default todosSlice.reducer;
