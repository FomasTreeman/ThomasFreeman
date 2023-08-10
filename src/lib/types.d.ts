export interface IPinnedData {
    production: string
    imageExt: '.png' | '.jpg' | '.jpeg' | '.webp'
    description: string
}

export interface IRepo extends IPinnedData {
    error: boolean, // error for specific repo
    md: string,
    name: string,
    url: string
}

export type Data = {
    error: boolean // error fetching all repos
    repos: IRepo[] | Promise<IRepo[]>
}
