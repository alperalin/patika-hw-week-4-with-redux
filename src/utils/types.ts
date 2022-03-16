export interface ReduxTodoStateInterface {
	data: TodoInterface[];
	filter: {
		categoryId: number | null;
		statusId: number | null;
	};
	apiStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
	apiError: string | null;
}

export interface ReduxCategoryStateInterface {
	data: CategoryInterface[];
	apiStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
	apiError: string | null;
}

export interface TodoInterface {
	id: number;
	userId: number;
	title: string;
	categoryId: number;
	statusId: number;
	updatedAt: string;
	createdAt: string;
}

export interface TodoAddInterface {
	title: string;
	categoryId: number;
	statusId: number;
}

export interface TodoUpdateInterface extends TodoAddInterface {
	id: number;
}

export interface TodoDeleteInterface {
	id: number;
}

export interface CategoryInterface {
	id: number;
	userId: number;
	title: string;
	createdAt: string;
	updatedAt: string;
}

export interface CategoryAddProps {
	title: CategoryInterface['title'];
}

export interface CategoryUpdateProps {
	id: CategoryInterface['id'];
	title: CategoryInterface['title'];
}

export interface CategoryDeleteProps {
	id: CategoryInterface['id'];
}

export interface StatusCommon {
	title: string;
	categoryId: number;
	color: string;
}

export interface Status extends StatusCommon {
	id: number;
}

export interface StatusGetProps {
	categoryId: number;
}

export interface SelectValuesInterface {
	categoryId: number;
	statusId: number;
}
