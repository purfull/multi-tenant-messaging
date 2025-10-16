import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan'; 
import messageRoutes from './routes/message.routes.ts';
import orgRoutes from './routes/org.routes.ts';
import healthRoutes from './routes/health.routes.ts';
import { errorHandler } from './middlewares/errorHandler.ts';

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev')); 

app.use('/messages', messageRoutes);
app.use('/orgs', orgRoutes);
app.use('/health', healthRoutes);

app.use(errorHandler);

export default app;
