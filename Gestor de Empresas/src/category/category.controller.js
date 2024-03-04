'use strict'

import Category from './category.model.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is runnign'})
}

export const newCategory = async(req, res)=>{
    try{
        let data = req.body
        console.log(data)
        let category = new Category(data)
        await category.save()
        return res.send({message: `La categoria ${data.categoryName} fue registrada`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'Error, no se pudo registrar la categoria.'})
    }
}

export const getCategories = async(req, res)=>{
    try{
        let category = await Category.find()
        if(!category) return res.status(404).send({message: 'Categorias no encontradas'})
        return res.send({category})
    }catch(err){
        console.error(err)
        return res.status(500).send({menssage:'Error con las categorias'})
    }
    }