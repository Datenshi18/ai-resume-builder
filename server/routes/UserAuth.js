const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/UserModel");
const jwt = require('jsonwebtoken');




const router = express.Router();

// REGISTER API
router.post("/reg", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // send success response
    res.json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Find user in database
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
