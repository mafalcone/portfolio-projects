import express from 'express';
import {register,login,refreshToken,logout} from '../controllers/auth.js';
import authRefresh from '../middleware/authRefresh.js';
import authAccess from '../middleware/authAccess.js';

const r=express.Router();
r.post('/register', register);
r.post('/login', login);
r.post('/refresh', authRefresh, refreshToken);
r.post('/logout', authAccess, logout);
export default r;
