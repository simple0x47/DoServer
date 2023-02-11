import express, { Express } from 'express';
import bodyParser, { BodyParser } from 'body-parser';
import { initializeTaskApi } from './api/task/init';

const app: Express = express();
const port = 8020;

const jsonParser = bodyParser.json();
app.use(jsonParser);

initializeTaskApi(app);

app.listen(port, () => {
    console.log(`[server]: server running at http://localhost:${port}`);
});