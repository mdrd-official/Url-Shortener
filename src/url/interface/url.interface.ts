import { Prop, Schema} from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Url extends Document {
  @Prop()
  urlCode: string;

  @Prop()
  originalUrl: string;

  @Prop()
  shortUrl: string;

  @Prop({ default: Date.now })
  created: Date;
}

