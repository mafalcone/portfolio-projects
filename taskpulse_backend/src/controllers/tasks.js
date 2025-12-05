import Task from '../models/Task.js';

export async function getTasks(req,res){
 const tasks=await Task.find({userId:req.userId});
 res.json(tasks);
}

export async function createTask(req,res){
 const {title,description,priority}=req.body;
 const t=await Task.create({title,description,priority,userId:req.userId});
 res.json(t);
}

export async function updateTask(req,res){
 const {id}=req.params;
 const t=await Task.findOneAndUpdate({_id:id,userId:req.userId}, req.body, {new:true});
 res.json(t);
}

export async function deleteTask(req,res){
 const {id}=req.params;
 await Task.deleteOne({_id:id,userId:req.userId});
 res.json({message:'Deleted'});
}
