import { promises as fs } from "fs";
import { Location, LocationWithoutId } from "./types";
import crypto from "crypto";

const fileName = "locations_db.json";
let data: Location[] = [];

const locations_fileDb = {
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

    getLocations(): Location[] {
        return data;
    },

    getLocationById(id: string): Location | undefined {
        return data.find(category => category.id === id);
    },

    async addLocation(msg: LocationWithoutId): Promise<Location> {
        const id = crypto.randomUUID();
        const category: Location = { id, ...msg };
        data.push(category);
        await this.save();
        return category;
    },

    async deleteLocation(id: string): Promise<boolean> {
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

export default locations_fileDb;
