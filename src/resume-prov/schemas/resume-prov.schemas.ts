import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Provider } from 'src/provider/schemas/providers.schemas';
import { ScholarProv } from 'src/scholar-prov/schemas/scholar-prov.schemas';
import { User } from 'src/users/schemas/user.schema';

export type ResumeProDocument = HydratedDocument<ResumePro>;

@Schema({ timestamps: true })
export class ResumePro {
    @Prop()
    email: string;

    @Prop()
    name: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
    })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop()
    urlCV: string;

    @Prop()
    note: string;

    @Prop()
    status: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ScholarProv.name })
    scholarProv: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Provider.name })
    provider: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.Array })
    history: {
        status: string;
        updatedAt: Date;
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
        };
    }[];

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

export const ResumeProSchema = SchemaFactory.createForClass(ResumePro);
