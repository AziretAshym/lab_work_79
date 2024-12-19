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

export interface Item {
    id: string;
    categoryId: string;
    locationId: string;
    name: string;
    description?: string;
    image: string | null;
    addedDate: string;
}

export type ItemWithoutId = Omit<Item, "id" | "addedDate">;