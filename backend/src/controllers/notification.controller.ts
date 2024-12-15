import { ApiResponse } from "../lib/apiResponse";
import { asyncHandler } from "../lib/asyncHandler";
import Notification from "../models/notification.model";

export const getNotifications = asyncHandler(async (req, res) => {
    try {
        const notification = await Notification.find({ receiver: req.user._id }).sort({ _id: -1 });;
        return res.status(200).json(new ApiResponse(200, notification, "Fetched"));
    } catch (error) {
        if (error instanceof ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        // Fallback for unhandled errors
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Internal Server Error"));
    }
})
export const readNotification = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            throw new ApiResponse(400, null, "Please Provide notification id");
        }
        const notification = await Notification.findOne({ _id: id, receiver: req.user._id });
        if (!notification) {
            throw new ApiResponse(404, null, "Notification not found");
        }
        notification.isRead = true;
        await notification.save();
        return res.status(200).json(new ApiResponse(200, notification, "Fetched"));
    } catch (error) {
        if (error instanceof ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        // Fallback for unhandled errors
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Internal Server Error"));
    }
})