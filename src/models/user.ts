import { Model, DataTypes, type Optional } from 'sequelize';
import { sequelize } from '~/config/database';

interface UserAttributes {
  id: bigint
  name: string
  email?: string | null
  phone_number: string
  pw_hash: string
  created_at?: Date
  updated_at?: Date
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: bigint;
  public name!: string;
  public email?: string | null;
  public phone_number!: string;
  public pw_hash!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  name: {
    type: DataTypes.TEXT
  },
  phone_number: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  pw_hash: {
    type: DataTypes.STRING
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'user',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default User;
