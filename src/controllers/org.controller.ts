import type { Request, Response } from 'express';
import { Org } from '../models/org.model.ts';
import { sequelize } from '../config/db.ts';

export const createOrg = async (req: Request, res: Response) => {
  const { name, initialCredits } = req.body;

  if (!name || initialCredits === undefined) {
    return res.status(400).json({ error: 'name and initialCredits are required' });
  }

  try {
    const org = await Org.create({ name, creditBalance: initialCredits });
    res.json({ success: true, org });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
};

export const getOrg = async (req: Request, res: Response) => {
  const orgId = req.params.id;

  try {
    const org = await Org.findByPk(orgId);
    if (!org) return res.status(404).json({ error: 'org not found' });

    res.json({ success: true, org });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
};

export const updateCredits = async (req: Request, res: Response) => {
  const orgId = req.params.id;
  const { delta } = req.body;

  if (delta === undefined) return res.status(400).json({ error: 'delta is required' });

  try {
    const org = await Org.findByPk(orgId);
    if (!org) return res.status(404).json({ error: 'org not found' });

    org.creditBalance += delta;
    if (org.creditBalance < 0) org.creditBalance = 0;

    await org.save();
    res.json({ success: true, org });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
};
