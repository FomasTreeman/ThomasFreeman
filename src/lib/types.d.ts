export interface IExternalLink {
	id: string;
	name: string;
	url: string;
	icon?: string; // Optional icon name or emoji
	type?: 'preview' | 'docs' | 'demo' | 'custom'; // Link type for styling
}

export interface IPinnedData {
	production?: string;
	summary: string;
	stack: string[];
	description: string;
	externalLinks?: IExternalLink[]; // Array of additional external links
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
