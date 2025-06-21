import mongoose, { Document, Schema } from 'mongoose';

export interface History extends Document {
  user: mongoose.Types.ObjectId;
  weather: mongoose.Types.ObjectId;
  lat: number;
  lon: number;
  requestedAt: Date;
}

const historySchema = new Schema<History>({
    user: { 
        type: Schema.Types.ObjectId,
         ref: 'User', 
         index: true, 
         required: true },
    weather: {
         type: Schema.Types.ObjectId, 
         ref: 'Weather', 
         required: true },
    lat: { 
        type: Number, 
        required: true },
    lon: { 
        type: Number, 
        required: true },
    },
        {  
            timestamps: true 
        }
  
  );
  
  export default mongoose.model<History>('History', historySchema);