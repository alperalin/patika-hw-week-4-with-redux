import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { service } from '../../utils/service';

// interface
import {
	ReduxCategoryStateInterface,
	CategoryInterface,
	CategoryAddProps,
	CategoryUpdateProps,
	CategoryDeleteProps,
} from '../../utils/types';

// Initial State
const initialState: ReduxCategoryStateInterface = {
	data: [],
	apiStatus: 'idle',
	apiError: null,
};

// Redux Slice for categories
const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		logoutCategories() {
			return initialState;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(fetchCategories.pending, (state, action) => {
				state.apiStatus = 'loading';
			})
			.addCase(fetchCategories.fulfilled, (state, action) => {
				state.apiStatus = 'succeeded';
				state.data = state.data.concat(action.payload);
			})
			.addCase(fetchCategories.rejected, (state, action) => {
				state.apiStatus = 'failed';
				state.apiError = action.error.message || null;
			});

		builder.addCase(addCategory.fulfilled, (state, action) => {
			state.data.push(action.payload);
		});

		builder.addCase(updateCategory.fulfilled, (state, action) => {
			const { id } = action.payload;
			const index = state.data.findIndex((item) => item.id === id);

			state.data = [
				...state.data.slice(0, index),
				action.payload,
				...state.data.slice(index + 1),
			];
		});

		builder.addCase(deleteCategory.fulfilled, (state, action) => {
			const { id } = action.payload;
			const index = state.data.findIndex((item) => item.id === id);

			state.data = [
				...state.data.slice(0, index),
				...state.data.slice(index + 1),
			];
		});
	},
});

// Thunks
// Fetching categories from api
const fetchCategories = createAsyncThunk(
	'categories/fetchCategories',
	async () => {
		// API call
		return await service.get('/category').then((response) => {
			return response.data;
		});
	}
);

// Add new category
const addCategory = createAsyncThunk(
	'categories/addCategory',
	async ({ title }: CategoryAddProps) => {
		// API call
		return await service
			.post('/category', { title })
			.then((response) => response.data);
	}
);

const updateCategory = createAsyncThunk(
	'categories/updateCategory',
	async ({ id, title }: CategoryUpdateProps) => {
		// API call
		return await service
			.put(`/category/${id}`, { title })
			.then((response) => response.data);
	}
);

const deleteCategory = createAsyncThunk(
	'categories/deleteCategory',
	async ({ id }: CategoryDeleteProps) => {
		// API call
		return await service
			.delete(`/category/${id}`)
			.then((response) => ({ id, data: response.data }));
	}
);

// Export Actions
const { logoutCategories } = categoriesSlice.actions;

// Exports
export {
	logoutCategories,
	fetchCategories,
	addCategory,
	updateCategory,
	deleteCategory,
};

// Export categoriesSlice Recuder as Default
export default categoriesSlice.reducer;
