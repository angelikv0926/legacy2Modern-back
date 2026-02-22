import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import routesMigrate from './routes/migration.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuracion de 5 peticiones por minuto
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: { error: "Se supero el limite de peticiones por minuto" },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api', limiter, routesMigrate);

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});