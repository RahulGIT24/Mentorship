import { ApiResponse } from "../lib/apiResponse.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { extractKeywords } from "../lib/extractKeywords.js";
import User from "../models/user.model.js";

export const matchMeWith = asyncHandler(async (req, res) => {
    let { preference } = req.body; // User's preference input
    const { page = 1, limit = 10 } = req.query;

    if(preference && String(preference).length < 50){
        throw new ApiResponse(400,null,"preference should contain at least 50 characters");
    }

    // Remove commas and convert to plain text
    if (preference) {
        preference = preference.replace(/,/g, ''); // Remove all commas
    }

    // Extract current user
    const user = await User.findById(req.user._id);
    if(user?.verificationStatus === false){
        throw new ApiResponse(401,null,"User not verified");
    }
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const userSkills = user.skills || []; // User's existing skills
    const userInterests = user.interest || []; // User's existing interests

    try {
        let query;

        if (preference) {
            // Extract keywords from user preference
            const keywords = extractKeywords(preference); // Assuming preference includes words like skills or interests
            const keywordPattern = keywords.join("|"); // Combine the keywords into a pattern for matching

            // Match the whole word/phrase in the bio, removing case sensitivity
            query = {
                _id: { $ne: req.user._id }, // Exclude the current user
                $or: [
                    { bio: { $regex: `\\b(${keywordPattern})\\b`, $options: "i" } }, // Match whole keywords in bio (case-insensitive)
                    { skills: { $elemMatch: { $in: keywords } } }, // Match skills from keywords
                    { interest: { $elemMatch: { $in: keywords } } }, // Match interests from keywords
                ],
                verificationStatus: true
            };
        } else {
            // Match based on user's existing skills and interests
            query = {
                _id: { $ne: req.user._id }, // Exclude the current user
                $or: [
                    { skills: { $elemMatch: { $in: userSkills } } }, // Match based on user's skills
                    { interest: { $elemMatch: { $in: userInterests } } }, // Match based on user's interests
                ],
                verificationStatus: true
            };
        }

        // Fetch users with pagination
        const matchedUsers = await User.find(query)
            .select("name profileImage username skills bio interest _id role")
            .skip((page - 1) * limit) // Pagination: Skip previous pages
            .limit(parseInt(limit)) // Limit results per page
            .lean(); // Use lean() to improve performance if you don't need Mongoose document features

        // Prepare the response
        res.status(200).json(
            new ApiResponse(
                200,
                {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: matchedUsers.length,
                    users: matchedUsers,
                },
                preference
                    ? "Users Based On Your Preferences"
                    : "Users That Match Your Skills and Interests"
            )
        );
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
