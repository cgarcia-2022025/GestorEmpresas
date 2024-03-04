'use strict'

import jwt from 'jsonwebtoken'
import User from '../user/user.model.js'

export const validateJwt = async(req, res, next)=>{
    try{
        //Obtener la llave de acceso al token
        let secretKey = process.env.SECRET_KEY
        //Obtener el token de los headers
        let { authorization } = req.headers
        //Verificar si viene el token
        if(!authorization ) return res.status(401).send({message: 'Unauthorized'})
        //Obtener el uid del usuario que envio el token
        let { uid } = jwt.verify(authorization, secretKey)
        //Validar si aun existe la BD
        let user = await User.findOne({_id : uid })
        if(!user) return res.status(401).send({message: 'User not found/Authorized'})
        req.user = user
    next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid token'})
    }
}