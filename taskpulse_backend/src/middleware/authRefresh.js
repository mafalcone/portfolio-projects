import jwt from 'jsonwebtoken';
export default (req,res,next)=>{
 const token=req.body.refreshToken;
 if(!token) return res.status(401).json({error:'No refresh token'});
 try{
  const decoded=jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  req.userId=decoded.id;
  next();
 }catch(e){ return res.status(401).json({error:'Invalid refresh token'}); }
};
