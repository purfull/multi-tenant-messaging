import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.ts';

export class Message extends Model {
  declare id: number;
  declare to: string;
  declare channel: 'sms' | 'email';
  declare body: string;
  declare status: 'QUEUED' | 'SENT' | 'FAILED';
  declare createdAt: Date;
}

Message.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    to: { type: DataTypes.STRING, allowNull: false },
    channel: { type: DataTypes.ENUM('sms', 'email'), allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('QUEUED', 'SENT', 'FAILED'), allowNull: false },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    updatedAt: false, 
  }
);
