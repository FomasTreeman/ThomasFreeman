export interface IPinnedData {
	production?: string;
	summary: string;
	stack: string[];
	description: string;
}

export interface IRepo extends IPinnedData {
	error: boolean; // error for specific repo
	name: string;
	url: string;
	color?: { overlay: string; before: string };
	image?: string;
	customTitle?: string;
}

export type Data = {
	error: boolean; // error fetching all repos
	repos: IRepo[] | Promise<IRepo[]>;
};
