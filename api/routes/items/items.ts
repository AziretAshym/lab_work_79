import express from "express";
import {Category, Item, ItemWithoutId} from "../../types";
import {imagesUpload} from "../../multer";
import mysqldb from "../../mysqldb";
import {ResultSetHeader} from "mysql2";

const itemRouter = express.Router();

itemRouter.get("/", async (_req, res) => {
    const connection = await mysqldb.getConnection();
    const [result] = await connection.query("SELECT * FROM items");
    const items = result as Item[];

    res.send(items);
});

itemRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const connection = await mysqldb.getConnection();
    const [result] = await connection.query("SELECT * FROM items WHERE id = ?", [id]);

    const item = result as Item[];

    if (item.length === 0) {
        res.status(404).send({ error: "Not found" });
    } else {
        res.send(item[0])
    }
});

itemRouter.post("/", imagesUpload.single("image"), async (req, res) => {
    try {
        if (!req.body.categoryId || !req.body.locationId || !req.body.title) {
            res.status(400).send("Category ID, Location ID, and Title cannot be empty.");
            return;
        }

        const connection = await mysqldb.getConnection();

        const [categoryResult] = await connection.query(
            "SELECT id FROM categories WHERE id = ?",
            [req.body.categoryId]
        );
        if ((categoryResult as Category[]).length === 0) {
            res.status(404).send({ error: `Category with ID ${req.body.categoryId} not found.` });
            return;
        }

        const [locationResult] = await connection.query(
            "SELECT id FROM locations WHERE id = ?",
            [req.body.locationId]
        );
        if ((locationResult as Location[]).length === 0) {
            res.status(404).send({ error: `Location with ID ${req.body.locationId} not found.` });
            return;
        }

        const item: ItemWithoutId = {
            category_id: Number(req.body.categoryId),
            location_id: Number(req.body.locationId),
            title: req.body.title,
            description: req.body.description || null,
            image: req.file ? "images/" + req.file.filename : null,
        };

        const [result] = await connection.query(
            "INSERT INTO items (category_id, location_id, title, description, image) VALUES (?, ?, ?, ?, ?)",
            [item.category_id, item.location_id, item.title, item.description, item.image]
        );

        const resultHeader = result as ResultSetHeader;
        const [resultCreatedItem] = await connection.query("SELECT * FROM items WHERE id = ?", [resultHeader.insertId]);
        const createdItem = resultCreatedItem as Item[];

        if (createdItem.length === 0) {
            res.status(404).send({ error: "Failed to fetch the newly created item." });
        } else {
            res.status(201).send(createdItem[0]);
        }
    } catch (e) {
        console.error(e);
    }
});



itemRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const connection = await mysqldb.getConnection();

        const [result] = await connection.query("DELETE FROM items WHERE id = ?", [id]);

        const resultHeader = result as ResultSetHeader;

        if (resultHeader.affectedRows === 0) {
            res.status(404).send({ error: "Item not found" });
        } else {
            res.send({ message: "Item deleted successfully" });
        }
    } catch (e) {
        console.error(e);
    }
});


export default itemRouter;
