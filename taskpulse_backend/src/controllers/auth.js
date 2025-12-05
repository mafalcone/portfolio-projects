import User from '../models/User.js';
import Refresh from '../models/RefreshToken.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

function hashToken(t){
 return crypto.createHash('sha256').update(t).digest('hex');
}

export async function register(req,res){
 try{
  const {email,password}=req.body;
  const exists=await User.findOne({email});
  if(exists) return res.status(400).json({error:'User exists'});
  const hashed=await bcrypt.hash(password,10);
  const user=await User.create({email,password:hashed});
  res.json({message:'Registered'});
 }catch(e){ res.status(500).json({error:e.message}); }
}

export async function login(req,res){
 try{
  const {email,password}=req.body;
  const user=await User.findOne({email});
  if(!user) return res.status(400).json({error:'Invalid credentials'});
  const valid=await bcrypt.compare(password,user.password);
  if(!valid) return res.status(400).json({error:'Invalid credentials'});

  const access=jwt.sign({id:user._id}, process.env.JWT_ACCESS_SECRET, {expiresIn:'15m'});
  const refresh=jwt.sign({id:user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn:'7d'});

  await Refresh.deleteMany({userId:user._id});
  await Refresh.create({
    userId:user._id,
    tokenHash:hashToken(refresh),
    expires:new Date(Date.now()+7*24*60*60*1000)
  });

  res.json({accessToken:access, refreshToken:refresh});
 }catch(e){ res.status(500).json({error:e.message}); }
}

export async function refreshToken(req,res){
 try{
  const {refreshToken}=req.body;
  const hash=hashToken(refreshToken);
  const stored=await Refresh.findOne({tokenHash:hash});
  if(!stored) return res.status(401).json({error:'Refresh not valid'});

  const access=jwt.sign({id:stored.userId}, process.env.JWT_ACCESS_SECRET, {expiresIn:'15m'});
  res.json({accessToken:access});
 }catch(e){ res.status(500).json({error:e.message}); }
}

export async function logout(req,res){
 try{
  await Refresh.deleteMany({userId:req.userId});
  res.json({message:'Logged out'});
 }catch(e){ res.status(500).json({error:e.message}); }
}
