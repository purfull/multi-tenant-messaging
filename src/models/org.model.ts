import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.ts';

export class Org extends Model {
  declare id: number;
  declare name: string;
  declare creditBalance: number;
}

Org.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    creditBalance: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  },
  { sequelize, tableName: 'orgs', timestamps: true }
);
