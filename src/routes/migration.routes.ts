import { Router } from 'express';
import { handleMigration, handleMigrationIA } from '../controllers/migration.controller';


const router = Router();

router.post('/migrate-code', handleMigration);
router.post('/migrate-code-ai', handleMigrationIA);

export default router;