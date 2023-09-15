import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CourseDto } from '../dto/create-course.dto';
import { Document } from 'mongoose';

@Schema({ collection: 'courses' })
export class Course extends Document {
  @Prop({ type: String, required: true, ref: 'College', unique: true }) // Reference to College model
  collegeId: string;

  @Prop({ type: Array<CourseDto>, required: true })
  courses: CourseDto[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
