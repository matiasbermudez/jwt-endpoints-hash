import { app } from "./express";
import * as dotenv from 'dotenv'
import * as jwt from 'jsonwebtoken';
import { Auth } from './db/auth'
import { User } from "./db/user";
import { iniciarDatabase } from "./db/indexDB";
const crypto = require('crypto');

dotenv.config();
const PORT = process.env.PORT;
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

//MIDDLEWARE EXPRESS
function authMiddleware  (req,res,next){
    try {       
        const jwtHeadersRes = req.headers.authorization.split(' ')[1];
            const data = jwt.verify(jwtHeadersRes , JWT_PRIVATE_KEY);
            req._user = data;
            next();
    } catch (error) {
        
        res.status(401).json(error)
    }
}


(async () => {
    const getSHA1ofJSON = function (input) {
        return crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex')
    }
    await iniciarDatabase();
    app.get('/test', (req, res) => {
        res.send('All ok')
    });

    app.post('/auth', async (req, res) => {
        const userReqBody = req.body;

        const [user, userCreated] = await User.findOrCreate({
            where: { email: userReqBody.email },
            defaults: {
                fullName: userReqBody.fullName,
                birthDate: userReqBody.birthDate,
                email: userReqBody.email,
            },
        });
        console.log({ user, userCreated });

        const [auth, authCreated] = await Auth.findOrCreate({
            where: { email: userReqBody.email },
            defaults: {
                password: getSHA1ofJSON(userReqBody.password),
                email: userReqBody.email,
                user_id: user.get('id')
            },
        });
        console.log({ authCreated, auth });
        res.json(userReqBody)
    }),

        app.post('/auth/token', async (req, res) => {
            const userQuery = req.body;
            const bdQuery = await Auth.findOne(
                {
                    where: { email: userQuery.email }
                });

            //SI EL USUARIO EXISTE BDQUERY TRAE UN ELEMENTO QUE TRANSFORMO A JSON Y ME FIJO SI LA PASS ES LA MISMA HASHEANDOLA
            if (bdQuery) {
                const bdQueryJson = bdQuery.toJSON();
                    if(bdQueryJson.password === getSHA1ofJSON(userQuery.password)){
                        const jwToken = jwt.sign({ 
                            user_id : bdQueryJson.user_id }, 
                            JWT_PRIVATE_KEY, 
                            { algorithm: 'HS256'}
                        );
                        res.status(200).json(jwToken)
                    }else{
                        res.status(400).json('Usuario o Contraseña no encontrados')
                    }
                }else{
                    res.json("Email no encontrado ")
            }
        });

    
        app.get('/me',authMiddleware,async (req,res)=>{
            console.log(req._user)
            const userData = await User.findOne({where : {id : req._user.user_id}});
            res.json({
                autorizado : "Token ok ",
                userData
            })
            
        });

    app.listen(PORT, () => {
        console.log(`Server On : ${PORT}`)
    })
})()

