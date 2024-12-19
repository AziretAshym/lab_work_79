import express from "express";
import categories_fileDb from "../../categories_fileDb";
import { CategoryWithoutId } from "../../types";

const categoryRouter = express.Router();

categoryRouter.get('/', (_req, res) => {
    const categories = categories_fileDb.getCategories();
    res.send(categories);
});

categoryRouter.get('/:id', async (req, res) => {
    const {id} = req.params;
    const category = categories_fileDb.getCategoryById(id);

    if (!category) {
        res.status(404).send({ error: "Not found" });
        return;
    }

    res.send(category);
})

categoryRouter.post('/', async (req, res) => {
    if (!req.body.name) {
        res.status(400).send('Name cannot be empty');
        return;
    }

    const ctg: CategoryWithoutId = {
        name: req.body.name,
        description: req.body.description,
    };

    const savedCategory = await categories_fileDb.addCategory(ctg);
    res.status(201).send(savedCategory);
});

categoryRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const success = await categories_fileDb.deleteCategory(id);

    if (!success) {
        res.status(404).send({ error: "Category not found" });
        return;
    }

    res.send({ message: "Category deleted successfully" });
});

export default categoryRouter;
