export interface Category {
    id: string;
    title: string;
    description?: string;
}

export type CategoryWithoutId = Omit<Category, "id">;


export interface Location {
    id: string;
    title: string;
    description?: string;
}

export type LocationWithoutId = Omit<Location, "id">;

export interface Item {
    id: string;
    category_id: number;
    location_id: number;
    title: string;
    description?: string;
    image: string | null;
    created_at: string;
}

export type ItemWithoutId = Omit<Item, "id" | "created_at">;