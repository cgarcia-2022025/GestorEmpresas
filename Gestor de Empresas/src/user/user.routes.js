import express from "express";
import { validateJwt } from '../middlewares/validate-jws.js'
import { test, register, login, update, deleteU } from './user.controller.js';

const api = express.Router();

api.get('/test', test)
api.post('/register',register)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update) 
api.delete('/deleteu/:id', [validateJwt], deleteU)

export default api