import { Sequelize } from  "sequelize";
import * as dotenv from 'dotenv';
dotenv.config();

const db_key = process.env.DB_RELACIONAL_KEY
const sequelize = new Sequelize(`postgresql://neondb_owner:${db_key}@ep-jolly-recipe-a5kn4ubu.us-east-2.aws.neon.tech/neondb?sslmode=require`);

const iniciarDatabase = async () =>{
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter : true});
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } 
}

export { sequelize , iniciarDatabase}