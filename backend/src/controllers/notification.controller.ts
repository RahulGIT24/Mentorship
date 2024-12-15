import { ApiResponse } from "../lib/apiResponse.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import Notification from "../models/notification.model.js";

export const getNotifications = asyncHandler(async (req, res) => {
    try {
        const { type = "all", page = 1, limit = 10 } = req.query;

        const filter: { receiver: string, isRead?: boolean } = {
            receiver: req.user._id,
        };

        if (type === "read") {
            filter.isRead = true;
        } else if (type === "unread") {
            filter.isRead = false;
        } else if (type !== "all") {
            throw new ApiResponse(400, null, "Invalid Type");
        }

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            throw new ApiResponse(400, null, "Invalid pagination parameters");
        }

        const skip = (pageNumber - 1) * limitNumber;

        const notifications = await Notification.find(filter)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limitNumber);

        const totalNotifications = await Notification.countDocuments(filter);

        return res.status(200).json(
            new ApiResponse(200, {
                notifications,
                totalNotifications,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalNotifications / limitNumber),
            }, "Fetched")
        );
    } catch (error) {
        if (error instanceof ApiResponse) {
            return res.status(error.statuscode).json(error);
        }

        // Fallback for unhandled errors
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
});


export const readNotification = asyncHandler(async (req, res) => {
    try {
        const { id} = req.query;
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