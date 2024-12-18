import { promises as fs } from "fs";
import { Category, CategoryWithoutId } from "./types";
import crypto from "crypto";

const fileName = "categories_db.json";
let data: Category[] = [];

const categories_fileDb = {
    async init() {
        try {
            await fs.access(fileName);
        } catch {
            await fs.writeFile(fileName, JSON.stringify([]));
        }

        try {
            const fileContent = await fs.readFile(fileName);
            data = JSON.parse(fileContent.toString());
        } catch (e) {
            console.error("Failed to initialize database:", e);
        }
    },

    getCategories(): Category[] {
        return data;
    },

    getCategoryById(id: string): Category | undefined {
        return data.find(category => category.id === id);
    },

    async addCategory(msg: CategoryWithoutId): Promise<Category> {
        const id = crypto.randomUUID();
        const category: Category = { id, ...msg };
        data.push(category);
        await this.save();
        return category;
    },

    async deleteCategoryById(id: string): Promise<boolean> {
        const index = data.findIndex(category => category.id === id);
        if (index === -1) return false;

        data.splice(index, 1);
        await this.save();
        return true;
    },

    async save() {
        try {
            await fs.writeFile(fileName, JSON.stringify(data, null, 2));
        } catch (e) {
            console.error("Failed to save database:", e);
        }
    }
};

export default categories_fileDb;
