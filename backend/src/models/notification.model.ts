import mongoose, { Schema } from "mongoose";
import { INotification } from "../lib/interfaces";

const notification = new Schema<INotification & Document>({
    sender: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subject: {
        required: true,
        type: String,
    },
    description: {
        required: true,
        type: String
    },
    isRead: {
        required: true,
        default: false,
        type: Boolean
    },
},
    {
        timestamps: true
    })

const Notification = mongoose.model<INotification & Document>("Notification", notification)
export default Notification;