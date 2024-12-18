import { ApiResponse } from "../lib/apiResponse.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { sendNotification } from "../lib/notification.js";
import Connection from "../models/connection.model.js";

export const sendReq = asyncHandler(async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user._id;
        if (!receiverId) {
            throw new ApiResponse(400, null, "Please provide receiver id")
        }
        if (receiverId.toString() === senderId.toString()) {
            throw new ApiResponse(400, null, "You can't send request to yourself")
        }
        const existingConnection = await Connection.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        })
        if (existingConnection) {
            throw new ApiResponse(400, null, "Request already accepted or in pending state")
        }
        const username = req.user.username;
        await sendNotification({
            senderId, receiverId, subject: "Somebody sent you connection request", description: `@${username} wants to connect with you.`
        })
        const connection = await Connection.create({
            sender: senderId, receiver: receiverId
        })
        if (!connection) {
            throw new ApiResponse(400, null, "Unable to connect with user")
        }
        return res.status(200).json(new ApiResponse(200, null, "Connection Request Sent"));
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

export const acceptReq = asyncHandler(async (req, res) => {
    try {
        const { connectionId } = req.body;
        const loggedInUserId = req.user._id;
        if (!connectionId) {
            throw new ApiResponse(400, null, "Please provide receiver id")
        }
        const existingConnection = await Connection.findOne({ _id: connectionId, receiver: loggedInUserId });
        if (!existingConnection) {
            throw new ApiResponse(400, null, "Incorrect Connection id")
        }
        if (existingConnection.isAccepted == true) {
            throw new ApiResponse(400, null, "Already Connected")
        }
        const receiver = String(existingConnection?.sender);
        const sender = String(existingConnection?.receiver);
        existingConnection.isPending = false;
        existingConnection.isAccepted = true;
        await existingConnection.save();
        await sendNotification({
            senderId: sender,
            receiverId: receiver,
            subject: "Connection Request Accepted",
            description: `@${req.user.username} accepted your connection request`
        })
        return res.status(200).json(new ApiResponse(200, null, "Connection Request Accepted"));
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

export const getConnections = asyncHandler(async (req, res) => {
    try {
        const user = req.user._id;

        // Fetch all connections where the user is either sender or receiver and the connection is accepted
        const currentUserConnections = await Connection.find({
            $or: [
                { sender: user },
                { receiver: user }
            ],
            isAccepted: true
        })
        .populate({
            path: "sender",
            select: "username name role profileImage _id"
        })
        .populate({
            path: "receiver",
            select: "username name role profileImage _id"
        });

        // Filter out the logged-in user's ID and keep only the other person's ID
        const connections = currentUserConnections.map(connection => {
            const otherPerson:any = connection.sender._id.toString() === user.toString()
                ? connection.receiver
                : connection.sender;

            return {
                id: otherPerson._id,
                username: otherPerson.username,
                name: otherPerson.name,
                role: otherPerson.role,
                profileImage: otherPerson.profileImage
            };
        });

        return res.status(200).json(new ApiResponse(200, connections, "Fetched"));
    } catch (error) {
        if (error instanceof ApiResponse) {
            return res.status(error.statuscode).json(error);
        }
        // Fallback for unhandled errors
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Internal Server Error"));
    }
});


export const getPendingRequests = asyncHandler(async (req, res) => {
    try {
        const user = req.user._id;
        const { parameter } = req.query;
        let currentUserPendingConnections: any = []
        if (parameter === "sendbyme") {
            currentUserPendingConnections = await Connection.find({
                sender: user,
                isPending: true
            }).populate({
                path: "sender", select: "username name role profileImage _id"
            }).populate({
                path: "receiver", select: "username name role profileImage _id"
            })
        } else if (parameter === "receivedbyme") {
            currentUserPendingConnections = await Connection.find({
                receiver: user,
                isPending: true
            }).populate({
                path: "sender", select: "username name role profileImage _id"
            }).populate({
                path: "receiver", select: "username name role profileImage _id"
            })
        } else {
            throw new ApiResponse(400, null, "Invalid Query")
        }

        return res.status(200).json(new ApiResponse(200, currentUserPendingConnections, "Fetched"))
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

export const deleteConnection = asyncHandler(async(req,res)=>{
    try {
        const id = req.query.id
        const deleteConnection = await Connection.findOneAndDelete({
            $or:[
                {sender:id,receiver:req.user._id},
                {receiver:id,sender:req.user._id}
            ]
        })
        if(!deleteConnection){
            throw new ApiResponse(400,null,"Connection Not exist")
        }
        let message = "Request Cancelled"
        if(deleteConnection.isAccepted===true){
            message = "Connection Removed"
        }
        res.status(200).json(new ApiResponse(200,deleteConnection,message))
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

export const checkConnected = asyncHandler(async (req, res) => {
    try {
        const id = req.query.id;
        const userId = req.user._id;
        if (!id) {
            throw new ApiResponse(400, null, "Please Provide user id")
        }
        if (id.toString() === userId.toString()) {
            throw new ApiResponse(400, null, "Invalid")
        }
        const connected = await Connection.findOne({
            $or: [
                { sender: id, receiver: userId },
                { receiver: id, sender: userId }
            ],
        })
        if (!connected) {
            throw new ApiResponse(400, null, "Not connected")
        }
        return res.status(200).json(new ApiResponse(200, { pending: connected.isPending, accepted: connected.isAccepted,sender:connected.sender,receiver:connected.receiver,id:connected._id }, "Fetched"))
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