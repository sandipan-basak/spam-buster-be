import { Model, DataTypes } from 'sequelize';
import { sequelize } from '~/config/database';

class Contact extends Model { }

Contact.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  user_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  phone_number: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'contact',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Contact;
