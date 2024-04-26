import { Model, DataTypes, type Association } from 'sequelize';
import type User from '~/models/user';
import { sequelize } from '~/config/database';

interface ContactAttributes {
  id: string
  name: string
  phone_number: string
  user_id: bigint
  created_at?: Date
  updated_at?: Date
}

class Contact extends Model implements ContactAttributes {
  public id!: string;
  public name!: string;
  public phone_number!: string;
  public user_id!: bigint;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  public static associations: {
    User: Association<Contact, User>
  };
}

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
  modelName: 'Contact',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Contact;
