import { ApiResponse } from "../lib/apiResponse.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { extractKeywords } from "../lib/extractKeywords.js";
import User from "../models/user.model.js";

export const matchMeWith = asyncHandler(async (req, res) => {
    const { preference } = req.body; // User's preference input
    const { page = 1, limit = 10 } = req.query;

    if(preference && String(preference).length < 50){
        throw new ApiResponse(400,null,"preference should contain atleast 50 characters");
    }

    // Extract current user
    const user = await User.findById(req.user._id);
    if(user?.verificationStatus===false){
        throw new ApiResponse(401,null,"User not verified")
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
            const keywords = extractKeywords(preference);
            const keywordRegexes = keywords.map((keyword:string) => new RegExp(keyword, "i"));

            // Extract skills and interests from preference
            const preferenceSkills = extractKeywords(preference); // Assuming preference includes skill-related words
            const preferenceInterests = extractKeywords(preference); // Assuming preference includes interest-related words

            // Prepare case-insensitive regex for skills and interests from preference
            const preferenceSkillsRegexes = preferenceSkills.map((skill:string) => new RegExp(skill, "i"));
            const preferenceInterestsRegexes = preferenceInterests.map((interest:string) => new RegExp(interest, "i"));

            // Match only based on preference
            query = {
                _id: { $ne: req.user._id }, // Exclude the current user
                $or: [
                    { bio: { $regex: keywordRegexes.join("|"), $options: "i" } }, // Case-insensitive regex for bio
                    { skills: { $elemMatch: { $in: preferenceSkillsRegexes } } }, // Match based on preference skills
                    { interest: { $elemMatch: { $in: preferenceInterestsRegexes } } }, // Match based on preference interests
                ],
                verificationStatus:true
            };
        } else {
            // Match based on user's existing skills and interests
            const userSkillsRegexes = userSkills.map((skill) => new RegExp(skill, "i"));
            const userInterestsRegexes = userInterests.map((interest) => new RegExp(interest, "i"));

            query = {
                _id: { $ne: req.user._id }, // Exclude the current user
                $or: [
                    { skills: { $elemMatch: { $in: userSkillsRegexes } } }, // Match based on user's skills
                    { interest: { $elemMatch: { $in: userInterestsRegexes } } }, // Match based on user's interests
                ],
                verificationStatus:true
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
        console.error("Error finding users:", error);
        res.status(500).json({ message: "Server error" });
    }
});