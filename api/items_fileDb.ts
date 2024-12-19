import { promises as fs } from "fs";
import { Item, ItemWithoutId } from "./types";
import crypto from "crypto";

const fileName = "items_db.json";
let data: Item[] = [];

const items_fileDb = {
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

    getItems(): Item[] {
        return data;
    },

    getItemById(id: string): Item | undefined {
        return data.find(item => item.id === id);
    },

    async addItem(itm: ItemWithoutId): Promise<Item> {
        const id = crypto.randomUUID();
        const addedDate = new Date().toISOString();
        const item: Item = { id, ...itm, addedDate };
        data.push(item);
        await this.save();
        return item;
    },

    async deleteItem(id: string): Promise<boolean> {
        const index = data.findIndex(item => item.id === id);
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
    },
};

export default items_fileDb;
