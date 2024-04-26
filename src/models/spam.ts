import { Model, DataTypes } from 'sequelize';
import { sequelize } from '~/config/database';

interface SpamAttributes {
  id?: bigint
  phone_number: string
  name?: string
  report_count?: number
  first_reported_by_user_id: bigint
  created_at?: Date
  updated_at?: Date
}

class Spam extends Model implements SpamAttributes {
  public id?: bigint;
  public phone_number!: string;
  public name?: string;
  public report_count?: number;
  public first_reported_by_user_id!: bigint;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Spam.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  phone_number: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  report_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  first_reported_by_user_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.TEXT
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Spam',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Spam;
