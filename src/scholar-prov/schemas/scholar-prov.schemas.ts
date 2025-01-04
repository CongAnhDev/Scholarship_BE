import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Provider } from 'src/provider/schemas/providers.schemas';


export type ScholarProvDocument = HydratedDocument<ScholarProv>;

@Schema({ timestamps: true })
export class ScholarProv {
    @Prop()
    name: string;

    @Prop()
    image: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Provider.name })
    provider: mongoose.Schema.Types.ObjectId;

    @Prop()
    location: string;

    @Prop()
    level: string[];

    @Prop()
    major: string[];

    @Prop()
    quantity: number;

    @Prop()
    ielts: number;

    @Prop()
    GPA: number;

    @Prop()
    pay: number;

    @Prop()
    value: string;

    @Prop()
    description: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };

    @Prop()
    createdAt: Date;

    @Prop()
    updateAt: Date;
}

export const ScholarProvSchema = SchemaFactory.createForClass(ScholarProv);