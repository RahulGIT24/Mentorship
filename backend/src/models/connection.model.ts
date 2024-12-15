import mongoose, { Schema } from "mongoose";
import { IConnection } from "../lib/interfaces";

const connection = new Schema<IConnection & Document>({
    sender:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    isAccepted:{
        required:true,
        default:false,
        type:Boolean
    },
    isPending:{
        required:true,
        default:true,
        type:Boolean
    }

},{
    timestamps:true
})

const Connection = mongoose.model<IConnection & Document>("Connection",connection)
export default Connection;