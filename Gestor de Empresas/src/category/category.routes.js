import express from "express";
import { validateJwt } from '../middlewares/validate-jws.js'
import { newCategory, getCategories  } from './category.controller.js';
 

const api = express.Router();

api.post('/newCategory', [validateJwt], newCategory)
api.get('/getCategories', [validateJwt],getCategories)

export default api