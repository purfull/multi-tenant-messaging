import { Router } from 'express';
import { createOrg, getOrg, updateCredits } from '../controllers/org.controller.ts';

const router = Router();

router.post('/', createOrg);
router.get('/:id', getOrg);
router.post('/:id/credits', updateCredits);

export default router;
