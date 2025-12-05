import mongoose from 'mongoose';
const refreshSchema = new mongoose.Schema({
 userId:{ type:mongoose.Schema.Types.ObjectId, ref:'User' },
 tokenHash:String,
 expires:Date
});
export default mongoose.model('RefreshToken', refreshSchema);
