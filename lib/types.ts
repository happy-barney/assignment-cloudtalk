
export type Page_Spec = {
	page: number;
	size: number;
};

export type Page_Result = {
	next?:     number;
	previous?: number;
	size:      number;
	pages:     number;
};

export type Paged<T> = {
	page_info: Page_Result;
	result:    T;
};

