import mongoose, { Document, Schema } from 'mongoose';
export interface User extends Document {
    email: string;
    passwordHash: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
  }
  
  const userSchema = new Schema<User>(
    {
      email: { 
        type: String, 
        unique: true, 
        required: true 
      },
      passwordHash: { 
        type: String, 
        required: true 
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
      }
    },
    {
      timestamps: true 
    }
  );
  
  export default mongoose.model<User>('User', userSchema);