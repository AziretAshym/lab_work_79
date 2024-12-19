export interface Category {
    id: string;
    name: string;
    description?: string;
}

export type CategoryWithoutId = Omit<Category, "id">;


export interface Location {
    id: string;
    name: string;
    description?: string;
}

export type LocationWithoutId = Omit<Location, "id">;