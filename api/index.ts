import express from 'express';
import cors from 'cors';
import categories_fileDb from "./categories_fileDb";
import categoryRouter from "./routes/categories/categories";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/categories', categoryRouter)

const run = async () => {
    await categories_fileDb.init()
    app.listen(port, () => console.log(`Server started on port http://localhost:${port}`));
};

run().catch(console.error);