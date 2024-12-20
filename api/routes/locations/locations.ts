import express from "express";
import {LocationWithoutId} from "../../types";
import mysqldb from "../../mysqldb";
import {ResultSetHeader} from "mysql2";

const locationRouter = express.Router();

locationRouter.get('/', async (_req, res) => {
    try {
        const connection = await mysqldb.getConnection();
        const [result] = await connection.query("SELECT * FROM locations");

        const locations = result as Location[];
        res.send(locations);
    } catch (e) {
        console.error(e);
    }

});

locationRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const connection = await mysqldb.getConnection();

    const [result] = await connection.query("SELECT * FROM locations WHERE id = ?", [id]);

    const location = result as Location[];


    if (location.length === 0) {
        res.status(404).send({ error: "Not found" });
        return;
    } else {
        res.send(location);
    }
})

locationRouter.post('/', async (req, res) => {
    if (!req.body.title) {
        res.status(400).send('Name cannot be empty');
        return;
    }

    const loc: LocationWithoutId = {
        title: req.body.title,
        description: req.body.description,
    };

    const connection = await mysqldb.getConnection();

    const [result] = await connection.query("INSERT INTO locations (title, description) VALUES (?, ?)", [loc.title, loc.description]);

    const resultHeader = result as ResultSetHeader;
    const [resultCreatedLocation] = await connection.query("SELECT * FROM locations WHERE id = ?", [resultHeader.insertId]);
    const createdLocation = resultCreatedLocation as Location[];

    if (createdLocation.length === 0) {
        res.status(404).send({ error: "Not found" });
    } else {
        res.send(createdLocation[0]);
    }
});

locationRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await mysqldb.getConnection();

        const [itemCheck] = await connection.query(
            "SELECT COUNT(*) as itemCount FROM items WHERE location_id = ?",
            [id]
        );

        const itemCount = (itemCheck as { itemCount: number }[])[0].itemCount;

        if (itemCount > 0) {
            res.status(400).send({
                error: `Cannot delete location with ID ${id}. It is used in ${itemCount} items.`,
            });
            return;
        }

        const [result] = await connection.query("DELETE FROM locations WHERE id = ?", [id]);

        const resultHeader = result as ResultSetHeader;

        if (resultHeader.affectedRows === 0) {
            res.status(404).send({ error: "Location not found" });
        } else {
            res.send({ message: "Location deleted" });
        }
    } catch (e) {
        console.error(e);
    }
});


export default locationRouter;
