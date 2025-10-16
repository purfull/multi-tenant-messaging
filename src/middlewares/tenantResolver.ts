import type { Request, Response, NextFunction } from 'express';
import { initTenant, getTenantConnection } from '../config/tenantManager.ts';
import { Org } from '../models/org.model.ts'; 
export const tenantResolver = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.header('X-Org-Id');

    if (!orgId) return res.status(400).json({ error: 'X-Org-Id header missing' });

    const org = await Org.findByPk(orgId);
    if (!org) return res.status(404).json({ error: 'org not found' });

    await initTenant(orgId);

    (req as any).tenantDb = getTenantConnection(orgId);
    (req as any).orgId = orgId;

    next();
  } catch (err) {
    console.error('tenant resolver error:', err);
    res.status(500).json({ error: 'internal server error' });
  }
};
