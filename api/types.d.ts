export interface Category {
    id: string;
    name: string;
    description?: string;
}

export type CategoryWithoutId = Omit<Category, "id">;