import { Router } from 'express';
import { tenantResolver } from '../middlewares/tenantResolver.ts';
import { sendMessage, listMessages, getMessage } from '../controllers/message.controller.ts';

const router = Router();
// use tenantResolver to create separate schema for orgs
router.use(tenantResolver);

router.post('/', sendMessage);
router.get('/', listMessages);
router.get('/:id', getMessage);

export default router;
