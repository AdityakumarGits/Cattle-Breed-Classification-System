import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import resend from "../config/mail.js"; // 🚀 CENTRAL WORKER: Hamara Axios-Brevo wrapper yahin se email handle karega
import { OAuth2Client } from "google-auth-library"; // 🚀 FIX: Missing Google OAuth import waapas joda

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// =============================================================================
// 1. USER SIGNUP (MANUAL WITH OTP)
// =============================================================================
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const exitsUser = await User.findOne({ email });
    if (exitsUser) {
      return res.status(400).json({ error: "User already Exists " });
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!strongPassword.test(password)) {
      return res.status(400).json({
        error: "Password must contain uppercase, lowercase, number and special character",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      isVerified: false,
      authProvider: "local" 
    });

    // 🚀 CLEAN HIT: Ab yeh bina kisi SMTP timeout ke direct hamare Brevo API routing par hit karega
    await resend.emails.send({
      to: email,
      subject: "Verify Your Email - Cattle Classifier",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 500px;">
          <h2 style="color: #16a34a;">Welcome to Cattle Classifier</h2>
          <p>Your OTP for verification is:</p>
          <h1 style="color: #1e293b; letter-spacing: 4px; background: #f1f5f9; padding: 10px; text-align: center; border-radius: 6px;">${otp}</h1>
          <p style="color: #64748b; font-size: 14px;">This OTP will expire in 5 minutes.</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "OTP sent to your email",
      email,
    });

  } catch (error) {
    console.log("Signup Server Error:", error); 
    res.status(500).json({ error: "Signup failed" });
  }
};

// =============================================================================
// 2. USER OTP VERIFICATION
// =============================================================================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log("OTP Verification Error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

// =============================================================================
// 3. USER LOGIN (MANUAL)
// =============================================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid User or Password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        error: "Please login using Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, 
      sameSite: isProduction ? "none" : "lax", 
      path: "/",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// =============================================================================
// 4. GOOGLE ONE-TAP / SIGN-IN LOGIC
// =============================================================================
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload; 

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        googleId: sub,
        authProvider: "google",
        isVerified: true,
      });
    } else if (!user.googleId) {
      user.googleId = sub;
      user.isVerified = true;
      user.authProvider = "google";
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, 
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Google Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error) {
    console.log("Google Auth Server Error:", error);
    res.status(500).json({ error: "Google login failed" });
  }
};

// =============================================================================
// 5. FORGOT PASSWORD (OTP GENERATION)
// =============================================================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    // 🚀 Central Axios API Call
    await resend.emails.send({
      to: email,
      subject: "Reset Password OTP - Cattle Classifier",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 500px;">
          <h2 style="color: #ef4444;">Password Reset Request</h2>
          <p>Use the code below to reset your password:</p>
          <h1 style="color: #1e293b; letter-spacing: 4px; background: #fef2f2; padding: 10px; text-align: center; border-radius: 6px; border: 1px solid #fca5a5;">${otp}</h1>
          <p style="color: #64748b; font-size: 14px;">Valid for 5 minutes only.</p>
        </div>
      `,
    });

    return res.json