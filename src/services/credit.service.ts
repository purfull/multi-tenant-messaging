import { Org } from '../models/org.model.ts';
import type { Transaction } from 'sequelize';
import { sequelize } from '../config/db.ts';


export async function decrementCredit(orgId: string, t: Transaction) {
  
  const org = await Org.findByPk(orgId, { transaction: t, lock: t.LOCK.UPDATE });

  if (!org) throw new Error('org not found');

  if (org.creditBalance < 1) {
    const err: any = new Error('insufficient credits');
    err.code = 402;
    throw err;
  }

  org.creditBalance -= 1;
  await org.save({ transaction: t });

  return true;
}

export async function decrementCreditTransaction(orgId: string) {
  return sequelize.transaction(async (t) => {
    return decrementCredit(orgId, t);
  });
}
