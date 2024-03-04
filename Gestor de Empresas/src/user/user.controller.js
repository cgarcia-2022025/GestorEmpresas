'use strict'

import User from './user.model.js'
import { checkPassword, checkUpdate,  encrypt} from '../../utils/validator.js'
import { generateJwt } from '../../utils/jwt.js'


export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is runnign'})
}

// REGISTER
  // comentado por espera de revision

export const register = async(req, res)=>{
    try{
    //Capturar el formulario (body)
    let data = req.body
    console.log(data)
    //Encriptar la contraseña
    data.password = await encrypt(data.password)
    //Guardar la informacion de la BD
    let user = new User(data)
    await user.save()
    //Responder al usuario
    return res.send({message: `Registered succesfully, welcome ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err.errors})
    }
}


export const login = async(req, res)=>{
    try{
        //Capturar los datos (body)
        let { username , email, password } = req.body
        //Validar que el usuario exista
        let user = await User.findOne({username}) //Buscar un solo registro
        let correo = await User.findOne({email})
        //Verificar que la contraseña coincida
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name
            }
            //Generar token
                let token = await generateJwt(loggedUser)
            //Responder al usuario
            return res.send({message: `Welcome ${loggedUser.name}`, loggedUser,token})  
        }else if(correo && await checkPassword(password, correo.password)){
            let loggedUser = {
                uid: correo._id,
                username: correo.username,
                name: correo.name
            }
            //Generar token
                let token = await generateJwt(loggedUser)
            //Responder al usuario
            return res.send({message: `Welcome ${loggedUser.name}`, loggedUser,token})  
        }
        //Responde al usuario
        return res.status(404).send({message: 'User/Email or Password are incorrect'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}


export const update = async(req, res)=>{
    try {
        // id del usuario a actualizar
        let{id} = req.params
        //Obtener los datos a actualizar
        let data = req.body
        //Validar si date trae datos
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'have subitted some data that cannot be updated or missing data'})
        //Valida si tiene permisos(tokenizacion) *hoy no se ve*
        //Actualizar(BD)
        let updateUser = await User.findOneAndUpdate(
            {_id: id },//ObjectsID <- hexadecimal (Hora system, version Mongo, Llave privada)
            data, // datos que se van a actualizar
            {new: true}//Objeto de la BD ya actualizado
        )
        //Validar la actualizacion
        if(!updateUser) return res.status(401).send({menssage: 'User not found and not upadate'})
        //Respondo al usuario
        return res.send({menssage:'Update new', updateUser})
    } catch (err) {
        console.error(err)
        return res.status(500).send({menssage:'Error upadating account'})
    }
}


export const deleteU = async(req, res)=>{
    try{
        // Obtener el Id
        let { id } = req.params
        // Validar si esta logueado y es el mismo X No lo vemos hoy X
        // Eliminar (deleteOne / findOneAndDelete)
        let deletedUser = await User.findOneAndDelete({_id: id})
        // Verificar que se elimino
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
        // Responder
        return res.send({message: `Account with username ${deletedUser.username} deleted succesfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting acount'})
    }
}