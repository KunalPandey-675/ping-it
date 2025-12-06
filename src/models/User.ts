import mongoose, { Schema, Document } from "mongoose"

export interface Message extends Document {
    content: string;
    createdAt: Date
}
const MsgSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string; 
    verifyCode: string;
    verifyCodeExp: Date;
    isVerified: boolean;
    isAcceptingMsg: boolean; 
    messages: Message[]
}

const UserSchema: Schema<User>= new Schema({
    username:{
        type: String,
        required: [true,"Username is Required"],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: [true,"Email is Required"],
        unique: true,
        match:[/.+\@.+\..+/,'please use a valid email']
    },
    password:{
        type: String,
        required: [true,"Password is Required"]
    },
    verifyCode:{
        type: String,
        required: [true,"Code is Required"]
    },
    verifyCodeExp:{
        type: Date,
        required: [true,"verify code exp is Required"]
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAcceptingMsg:{
        type: Boolean,
        default: true,
    },
    messages:[MsgSchema]
})

const UserModel= (mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User", UserSchema)

export default UserModel;