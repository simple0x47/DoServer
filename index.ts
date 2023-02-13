import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { initializeTaskApi } from './api/task/init';
import cors from 'cors';
import { initializeAuthApi } from './api/user/init';

const app: Express = express();
const port = 8020;

const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cors({
    origin: "*"
}));

initializeAuthApi(app);
initializeTaskApi(app);

app.listen(port, () => {
    console.log(`[server]: server running at http://localhost:${port}`);
});