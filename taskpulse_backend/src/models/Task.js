import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
 title:String,
 description:String,
 completed:{type:Boolean, default:false},
 priority:{type:String, default:'medium'},
 userId:{ type:mongoose.Schema.Types.ObjectId, ref:'User' }
});
export default mongoose.model('Task', taskSchema);
