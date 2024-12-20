import express from 'express';
import categoryRouter from './routes/categories/categories';
import locationRouter from './routes/locations/locations';
import itemRouter from './routes/items/items';
import mysqldb from './mysqldb';

const app = express();
const port = 8000;

app.use(express.json());

app.use('/categories', categoryRouter);
app.use('/locations', locationRouter);
app.use('/items', itemRouter);

const run = async () => {
    try {
        await mysqldb.init();

        app.listen(port, () => console.log(`Server started on http://localhost:${port}`));
    } catch (e) {
        console.error(e);
    }
};

run().catch(console.error);

