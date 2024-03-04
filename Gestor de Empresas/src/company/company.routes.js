import express from "express";
import { validateJwt } from '../middlewares/validate-jws.js'
import { registerCompany, updateCompany, getCompanies, createExel, comForCategory, comForTrayectory  } from './company.controller.js';

const api = express.Router();

api.post('/registerCompany', [validateJwt],registerCompany)
api.put('/updateCompany/:id', [validateJwt], updateCompany) 
api.get('/getCompanies', [validateJwt],getCompanies)
api.get('/createExel', [validateJwt], createExel)
api.get('/comForCategory', [validateJwt], comForCategory)
api.get('/comForTrayectory', [validateJwt], comForTrayectory)

export default api