import express from 'express';
import cors from 'cors';
import categories_fileDb from "./categories_fileDb";
import categoryRouter from "./routes/categories/categories";
import locationRouter from "./routes/locations/locations";
import locations_fileDb from "./locations_fileDb";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/categories', categoryRouter);
app.use('/locations', locationRouter);

const run = async () => {
    await categories_fileDb.init();
    await locations_fileDb.init();
    app.listen(port, () => console.log(`Server started on port http://localhost:${port}`));
};

run().catch(console.error);