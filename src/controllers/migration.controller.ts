import type { Request, Response } from 'express';
import { MigrateReq } from '../interfaces/migration.types';
import { migrateCodeRegex } from '../services/regex.service';
import { migrateCodeIA } from '../services/ai.service';


export const handleMigration = (req: Request<{}, {}, MigrateReq>, res: Response) => {
    const { code, language } = req.body;
    if (!code || !language) {
        return res.status(400).json({ error: "Faltan parametros" });
    }
    try {
        const result = migrateCodeRegex(code, language);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Error interno" });
    }
};

export const handleMigrationIA = async (req: Request<{}, {}, MigrateReq>, res: Response) => {
    const { code, language } = req.body;
    if (!code || !language) {
        return res.status(400).json({ error: "Faltan parametros" });
    }
    try {
        const result = await migrateCodeIA(code, language);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Error en IA" });
    }
};