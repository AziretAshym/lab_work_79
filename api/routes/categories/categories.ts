import express from "express";
import {Category, CategoryWithoutId} from "../../types";
import mysqldb from "../../mysqldb";
import {ResultSetHeader} from "mysql2";

const categoryRouter = express.Router();

categoryRouter.get('/', async (_req, res) => {
    try {
        const connection = await mysqldb.getConnection();
        const [result] = await connection.query("SELECT * FROM categories");

        const categories = result as Category[];
        res.send(categories);
    } catch (e) {
        console.error("Error fetching categories:", e);
        res.status(500).send({ error: "Internal server error" });
    }
});

categoryRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const connection = await mysqldb.getConnection();

        const [result] = await connection.query("SELECT * FROM categories WHERE id = ?", [id]);

        const category = result as Category[];

        if (category.length === 0) {
            res.status(404).send({ error: "Category not found" });
        } else {
            res.send(category[0]);
        }
    } catch (e) {
        console.error("Error fetching category:", e);
        res.status(500).send({ error: "Internal server error" });
    }
});

categoryRouter.post('/', async (req, res) => {
    try {
        if (!req.body.title) {
            res.status(400).send('Title cannot be empty');
            return;
        }

        const ctg: CategoryWithoutId = {
            title: req.body.title,
            description: req.body.description,
        };

        const connection = await mysqldb.getConnection();

        const [result] = await connection.query(
            "INSERT INTO categories (title, description) VALUES (?, ?)",
            [ctg.title, ctg.description]
        );

        const resultHeader = result as ResultSetHeader;
        const [resultCreatedCategory] = await connection.query(
            "SELECT * FROM categories WHERE id = ?",
            [resultHeader.insertId]
        );
        const createdCategory = resultCreatedCategory as Category[];

        if (createdCategory.length === 0) {
            res.status(404).send({ error: "Category not found" });
        } else {
            res.status(201).send(createdCategory[0]);
        }
    } catch (e) {
        console.error("Error creating category:", e);
        res.status(500).send({ error: "Internal server error" });
    }
});



categoryRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const connection = await mysqldb.getConnection();

        const [itemCheck] = await connection.query(
            "SELECT COUNT(*) as itemCount FROM items WHERE category_id = ?",
            [id]
        );

        const itemCount = (itemCheck as { itemCount: number }[])[0].itemCount;

        if (itemCount > 0) {
            res.status(400).send({
                error: `Cannot delete category with ID ${id}. It is used in ${itemCount} items.`,
            });
            return;
        }

        const [result] = await connection.query("DELETE FROM categories WHERE id = ?", [id]);

        const resultHeader = result as ResultSetHeader;

        if (resultHeader.affectedRows === 0) {
            res.status(404).send({ error: "Category not found" });
        } else {
            res.send({ message: "Category deleted" });
        }
    } catch (e) {
        console.error(e);
    }
});


export default categoryRouter;
