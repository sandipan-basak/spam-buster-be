import { Model, DataTypes } from 'sequelize';
import { sequelize } from '~/config/database';

class Spam extends Model { }

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
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'spam',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Spam;
