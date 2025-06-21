import mongoose, { Document, Schema } from 'mongoose';

export interface Weather extends Document {
  lat: number;
  lon: number;
  data: any;
  fetchedAt: Date;
}

const weatherSchema = new Schema<Weather>({
  lat: { 
    type: Number, 
    required: true
 },
  lon: {
     type: Number,
      required: true 
    },
    data: Schema.Types.Mixed,
    fetchedAt: {
         type: Date, 
         default: Date.now, 
         index: { 
            expires: '30m'
         } }
  });
 


export default mongoose.model<Weather>('Weather', weatherSchema);