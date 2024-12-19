import express from "express";
import { ItemWithoutId } from "../../types";
import items_fileDb from "../../items_fileDb";
import categories_fileDb from "../../categories_fileDb";
import locations_fileDb from "../../locations_fileDb";
import { imagesUpload } from "../../multer";

const itemRouter = express.Router();

itemRouter.get("/", (_req, res) => {
    const items = items_fileDb.getItems();
    res.send(items);
});

itemRouter.get("/:id", (req, res) => {
    const { id } = req.params;
    const item = items_fileDb.getItemById(id);

    if (!item) {
        res.status(404).send({ error: "Item not found" });
        return;
    }

    res.send(item);
});

itemRouter.post("/", imagesUpload.single('image'), async (req, res) => {
    const { categoryId, locationId, name, description } = req.body;

    if (!categoryId || !locationId || !name) {
        res.status(404).send("Category ID, Location ID, and Name can not be empty.");
        return;
    }

    const categoryExists = categories_fileDb.getCategoryById(categoryId);
    if (!categoryExists) {
        res.status(404).send({ error: `Can not find category with id = ${categoryId}.` });
        return;
    }

    const locationExists = locations_fileDb.getLocationById(locationId);
    if (!locationExists) {
        res.status(404).send({ error: `Can not find location with id = ${locationId}` });
        return;
    }

    const item: ItemWithoutId = {
        categoryId,
        locationId,
        name,
        description,
        image: req.file ? "images/" + req.file.filename : null, // Путь к изображению
    };

    const savedItem = await items_fileDb.addItem(item);
    res.send(savedItem);
});

itemRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const success = await items_fileDb.deleteItem(id);

    if (!success) {
        res.status(404).send({ error: "Item not found" });
        return;
    }

    res.send({ message: "Item deleted" });
});

export default itemRouter;
