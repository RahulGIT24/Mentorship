import Notification from "../models/notification.model.js"
import { ApiResponse } from "./apiResponse.js";

export const sendNotification = async ({ senderId, receiverId, subject, description }: { senderId: string, receiverId: string, subject: string, description: string }) => {
    const notif = await Notification.create({
        sender:senderId,
        receiver:receiverId,
        subject:subject,
        description:description
    })
    if(!notif){
        throw new ApiResponse(500,null,"Unable to send notification")
    }
}