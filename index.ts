import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { initializeTaskApi } from './api/task/init';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import { initializeAuthApi } from './api/user/init';

const privateKey = fs.readFileSync(process.env["HTTPS_PRIVATE_KEY_FILE_PATH"]!, 'utf8');
const certificate = fs.readFileSync(process.env["HTTPS_CERTIFICATE_FILE_PATH"]!, 'utf8');

const httpsCredentials = { key: privateKey, cert: certificate };

const app: Express = express();
const port = 8020;

const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cors({
    origin: "*"
}));

initializeAuthApi(app);
initializeTaskApi(app);

https.createServer(httpsCredentials, app)
    .listen(port, () => {
        console.log(`[server]: server running at https://localhost:${port}`);
    });