import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes); // Mount routes under /api so Netlify redirects work nicely

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), service: 'AGE26-Backend-Serverless' });
});

export const handler = serverless(app);
