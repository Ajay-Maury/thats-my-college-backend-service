import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'colleges' }) // Define the schema for the 'colleges' collection in MongoDB
export class College extends Document {
  // Extend Document to create a Mongoose document

  @Prop({ type: String, unique: true, required: true }) // Define a property named 'name' as a unique, required string
  name: string;

  @Prop({ type: String, required: true }) // Define a property named 'address' as a required string
  address: string;

  @Prop({ type: [String], required: true }) // Define a property named 'contact' as an array of required strings
  contact: string[];

  @Prop({ type: String, required: true }) // Define a property named 'city' as a required string
  city: string;

  @Prop({ type: String, required: true }) // Define a property named 'state' as a required string
  state: string;

  @Prop({ type: [String], required: true }) // Define a property named 'collegeType' as an array of required strings
  collegeType: string[];

  @Prop({ type: Number, required: true }) // Define a property named 'established' as a required number
  established: number;

  @Prop({ type: String, required: true }) // Define a property named 'university' as a required string
  university: string;

  @Prop({ type: String, required: true }) // Define a property named 'logo' as a required string
  logo: string;

  @Prop({ type: [String], required: true }) // Define a property named 'image' as an array of required strings
  image: string[];

  @Prop({ type: String, required: true }) // Define a property named 'message' as a required string
  message: string;

  @Prop({ type: String, required: true }) // Define a property named 'details' as a required string
  details: string;

  @Prop({ type: Number, required: true }) // Define a property named 'rating' as a required number
  rating: number;

  @Prop({ type: Boolean, required: true }) // Define a property named 'featured' as a required boolean
  featured: boolean;
}

export const CollegeSchema = SchemaFactory.createForClass(College); // Create the Mongoose schema from the College class
