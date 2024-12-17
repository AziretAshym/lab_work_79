import express from 'express';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const run = async () => {
    app.listen(port, () => console.log(`Server started on port http://localhost:${port}`));
};

run().catch(console.error);