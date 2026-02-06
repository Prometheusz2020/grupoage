import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

// Mount similar paths to handle different execution contexts (Netlify Rewrite vs Raw)
const router = express.Router();
router.use('/', routes); // Routes already have their specific paths

app.use('/api', routes);
app.use('/.netlify/functions/api', routes); // Fallback for raw function path

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), service: 'AGE26-Backend-Serverless' });
});

export const handler = serverless(app);
