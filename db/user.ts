import { Model, DataTypes } from 'sequelize';
import { sequelize } from './indexDB';

export class User extends Model{};

 User.init({
    fullName: DataTypes.STRING,
    birthDate: DataTypes.STRING,
    email : DataTypes.STRING
 },{
    sequelize,
    modelName : 'user2'
 });