import express from "express";
import {LocationWithoutId} from "../../types";
import locations_fileDb from "../../locations_fileDb";

const locationRouter = express.Router();

locationRouter.get('/', (_req, res) => {
    const locations = locations_fileDb.getLocations();
    res.send(locations);
});

locationRouter.get('/:id', async (req, res) => {
    const {id} = req.params;
    const location = locations_fileDb.getLocationById(id);

    if (!location) {
        res.status(404).send({ error: "Not found" });
        return;
    }

    res.send(location);
})

locationRouter.post('/', async (req, res) => {
    if (!req.body.name) {
        res.status(400).send('Name cannot be empty');
        return;
    }

    const loc: LocationWithoutId = {
        name: req.body.name,
        description: req.body.description,
    };

    const savedLocation = await locations_fileDb.addLocation(loc);
    res.status(201).send(savedLocation);
});

locationRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const success = await locations_fileDb.deleteLocation(id);

    if (!success) {
        res.status(404).send({ error: "Location not found" });
        return;
    }

    res.send({ message: "Location deleted successfully" });
});

export default locationRouter;
