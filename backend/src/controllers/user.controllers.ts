import { ApiResponse } from "../lib/apiResponse.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import User from "../models/user.model.js";

export const getFilteredUsers = asyncHandler(async (req, res) => {
  try {
    let { role, skills, interests, name, page = 1 } = req.query;
    const loggedInUserId = req.user._id; // Retrieve logged-in user's ID (from middleware or query)
    const pageSize = 10; // Number of users per page

    const filter: any = { _id: { $ne: loggedInUserId } }; // Exclude logged-in user

    // Apply filters if provided
    if (role) filter.role = role;
    if (skills) filter.skills = { $in: [skills] };
    if (interests) filter.interest = { $in: [interests] };

    // If name is provided, search across the entire database without pagination
    if (name) {
      const searchRegex = new RegExp(name, 'i'); // Case-insensitive search
      filter.$or = [
        { username: { $regex: searchRegex } },
        { name: { $regex: searchRegex } }
      ];
    }

    // Count total matching users for pagination metadata (only if not searching by name)
    const totalUsers = name 
      ? await User.countDocuments(filter)  // If name is provided, count without pagination
      : await User.countDocuments({ ...filter, name: { $exists: true } });

    // Fetch users with pagination or without pagination based on the presence of `name`
    const users = await User.find(filter)
      .select('username role skills interest bio name')
      .skip(name ? 0 : (page - 1) * pageSize) // Skip users for previous pages if not searching by name
      .limit(name ? 0 : pageSize); // No limit if searching by name

    // Return users with pagination metadata (only if not searching by name)
    return res.status(200).json(new ApiResponse(200, {
      users,
      currentPage: name ? 1 : parseInt(page),
      totalPages: name ? 1 : Math.ceil(totalUsers / pageSize),
      totalUsers,
    }, "fetched"));
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


export const getUserById = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      throw new ApiResponse(400, null, "Invalid User ID");
    }
    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) {
      throw new ApiResponse(404, null, "User Not Found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User Details"));
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