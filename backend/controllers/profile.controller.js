import User from "../models/userModel.js";

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    let pic = null;

    if (req.file) {
      pic = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const userId = req.user._id;

    const updateData = {
      name,
      email,
    };

    if (pic) {
      updateData.pic = pic;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    
    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    res.status(500).json({ 
      message: "Profile update failed",
      error: err.message 
    });
  }
};

export default updateProfile;
