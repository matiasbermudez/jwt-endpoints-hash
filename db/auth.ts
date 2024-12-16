import { Model, DataTypes} from 'sequelize';
import { sequelize } from './indexDB';

export class Auth extends Model{};

Auth.init({
    password : DataTypes.STRING,
    email : DataTypes.STRING,
    user_id: DataTypes.INTEGER
},{
    sequelize,
    modelName : 'auth2'
})

