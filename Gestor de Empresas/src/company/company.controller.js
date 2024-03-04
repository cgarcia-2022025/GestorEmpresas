'use strict'

import Company from './company.model.js'
import {  checkUpdate } from '../../utils/validator.js'
import ExcelJS from 'exceljs';
/*import { generateJwt } from '../../utils/jwt.js'*/


// REGISTER

export const registerCompany = async (req, res) => {
    try {
        // Capturar el formulario (body)
        let data = req.body;

        // Validar que 'trayectory' sea mayor a 1900 y menor o igual a 2023
        // Se pone que el año sea mayor a 577 ya que la empresa Kongo Gumi es la empresa mas longeva que sigue activa, esta fue creada en el año 578
        if (data.trayectory < 577 || data.trayectory > 2023) {
            return res.status(400).send({ message: 'Invalid value for trayectory. It should be between 578 and 2023.' });
        }

        // Restar el número ingresado a 2024
        data.trayectory = 2024 - data.trayectory;

        console.log(data);

        // Guardar la información en la BD
        let company = new Company(data);
        await company.save();

        // Responder al usuario
        return res.send({ message: 'Registered successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error registering the company', err: err.errors });
    }
}


export const updateCompany = async (req, res) => {
    try {
        // Id del usuario a actualizar
        let { id } = req.params;

        // Obtener los datos a actualizar
        let data = req.body;

        // Validar si 'data' trae datos
        let update = checkUpdate(data, id);
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' });

        // Validar si 'trayectory' está dentro del rango permitido
        if (data.trayectory && (data.trayectory < 577 || data.trayectory > 2023)) {
            return res.status(400).send({ message: 'Invalid value for trayectory. It should be between 578 and 2023.' });
        }

        data.trayectory = 2024 - data.trayectory;

        // Actualizar (BD)
        let updateCompany = await Company.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );

        // Validar la actualización
        if (!updateCompany) return res.status(401).send({ message: 'User not found and not updated' });

        // Responder al usuario
        return res.send({ message: 'Update successful', updateCompany });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating account' });
    }
}


export const getCompanies = async (req, res) => {
    try {

        let { search } = req.body
        if (search == 'ascendente') {
        // Obtener todas las empresas en orden alfabético por nombre
        let compania = await Company.find().sort({ companyName: 1 })

        return res.send({ compania });
        }else if (search == 'descendente') {
            let compania = await Company.find().sort({ companyName: -1 })

            return res.send({ compania });
            } else{
            return res.status(400).send({ message: 'Invalid words, please user "ascendente" or "descendente" for alphabetical order.' })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error when searching for companies' })
    }
}

export const comForTrayectory = async(req, res)=>{
    try{
        //Obtener el parámetro de búsqueda
        let { search } = req.body
        //Buscar
        let companies = await Company.find(
            {trayectory: search}
        )
        //Validar la respuesta
        if(!companies) return res.status(404).send({message: 'product not found'})
        //Responder si todo sale bien
        return res.send({message: 'product found', companies})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching product'})
    }
}

//ARREGLAR!!!!!!!!!!!!!!!!!!!1
export const comForCategory = async(req, res)=>{
    try{
        //Obtener el parámetro de búsqueda
        let { search } = req.body
        //Buscar
        let companies = await Company.find(
            {category: search}
        )
        //Validar la respuesta
        if(!companies) return res.status(404).send({message: 'product not found'})
        //Responder si todo sale bien
        return res.send({message: 'product found', companies})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error searching product'})
    }
}



export const createExel = async (req, res) => {
    try {

        // Manda a llamar a los datos guardados de compañia
        const companies = await Company.find();

            // Si no se encuentran compañias las cuales agregar al exel, se enviara un mensaje
        if (companies.length === 0) {
            return res.status(404).send({ message: 'No companies found to export' });
        }
        // Crea un nuevo libro de Exel
        const workbook = new ExcelJS.Workbook();
        // Crea una nueva hoja de exel llamada Companies
        const worksheet = workbook.addWorksheet('Companies');

        // Crea las columnas Junto con la descripcion que llevara cada una
        worksheet.columns = [
            // El header indica el texto que llevara la columna, el key es la forma de identificar a la columna y el width le asigna un tamaño
            { header: 'Nombre de la Empresa', key: 'companyName', width: 20 },
            { header: 'Descripcion', key: 'companyDescription', width: 30 },
            { header: 'Nivel de Impacto', key: 'levelOfImpact', width: 15 },
            { header: 'Trayectoria(en años)', key: 'trayectory', width: 15 },
            { header: 'Categoria', key: 'category', width: 20 },
        ];

        // Usando la funcion de iteracion forEach, recorre el arreglo llamado company
        companies.forEach((company) => {
            // Agrega una columna por cada grupo de datos que el forEach posea, este contiene y manda a llamar a los atributos de las empresas
            worksheet.addRow({
                companyName: company.companyName,
                companyDescription: company.companyDescription,
                levelOfImpact: company.levelOfImpact,
                trayectory: company.trayectory,
                category: company.category
            });
        });

        // Genera el nombre para el Excel(se usa el Date.now() para que este le agregue la fecha exacta al nombre del archivo ya que esta es unica al llevar incluidos los segundos)
        const filename = `Compañias_${Date.now()}.xlsx`;

        // Guarda el archivo Excel
        await workbook.xlsx.writeFile(filename);

        return res.send({ message: 'The Exel has been created succesfully', filename });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error exporting to Excel' });
    }
}
