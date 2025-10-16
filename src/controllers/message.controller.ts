import type { Request, Response } from 'express';
import { decrementCreditTransaction } from '../services/credit.service.ts';
import { Message } from '../models/message.model.ts';
import { sendToGateway } from '../services/gateway.service.ts';

export const sendMessage = async (req: Request, res: Response) => {
  const orgId = (req as any).orgId;
  const tenantSequelize = (req as any).tenantDb;

  const { to, channel, body } = req.body;

  if (!to || !channel || !body) {
    return res.status(400).json({ error: 'invalid payload' });
  }

  try {
    // decrement credit
    await decrementCreditTransaction(orgId);

    const TenantMessage = tenantSequelize.model('Message');

    const message = await TenantMessage.create({
      to,
      channel,
      body,
      status: 'QUEUED',
    });

    sendToGateway(message)
      .then(async (success) => {
        message.status = success ? 'SENT' : 'FAILED';
        await message.save();
      })
      .catch(async () => {
        message.status = 'FAILED';
        await message.save();
      });

    res.json({ success: true, message });
  } catch (err: any) {
    if (err.code === 402) return res.status(402).json({ error: 'insufficient credits' });
    console.error('sendMessage error:', err);
    res.status(500).json({ error: 'internal server error' });
  }
};

export const listMessages = async (req: Request, res: Response) => {
  const tenantDb = (req as any).tenantDb;

  const status = req.query.status as string | undefined;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  try {
    const whereClause: any = {};
    if (status) whereClause.status = status;

    const messages = await (Message as any).findAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      sequelize: tenantDb,
    });

    res.json({ success: true, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
};

export const getMessage = async (req: Request, res: Response) => {
  const tenantDb = (req as any).tenantDb;
  const messageId = req.params.id;

  try {
    const message = await (Message as any).findByPk(messageId, { sequelize: tenantDb });

    if (!message) return res.status(404).json({ error: 'message not found' });

    res.json({ success: true, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
};
