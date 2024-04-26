import { Model, DataTypes } from 'sequelize';
import { sequelize } from '~/config/database';

interface SpamReportAttributes {
  id?: bigint
  phone_number: string
  user_id: bigint
  marked_at?: Date
}

class SpamReport extends Model implements SpamReportAttributes {
  public id?: bigint;
  public phone_number!: string;
  public user_id!: bigint;
  public readonly marked_at!: Date;
}

SpamReport.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  marked_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  }
}, {
  sequelize,
  modelName: 'SpamReport',
  timestamps: true,
  updatedAt: false,
  createdAt: 'marked_at'
});

export default SpamReport;
