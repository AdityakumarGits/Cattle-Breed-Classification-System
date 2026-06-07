import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import resend from "../config/mail.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// =============================================================================
// 1. USER SIGNUP (MANUAL WITH OTP)
// =============================================================================
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check karo user already exists or not
    const exitsUser = await User.findOne({ email });
    if (exitsUser) {
      return res.status(400).json({
        error: "User already Exists ",
      });
    }
    //strong password
   const strongPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (!strongPassword.test(password)) {
  return res.status(400).json({
    error:
      "Password must contain uppercase, lowercase, number and special character",
  });
}
    // Password hash karo
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Naya user create karo (isVerified: false hoga jab tak OTP enter na kare)
    await User.create({
      fullName,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      isVerified: false,
      authProvider: "local" // Default local auth
    });

    // Verification OTP Send karo
    await resend.emails.send({
  from: "onboarding@resend.dev",
  to: email,
  subject: "Verify Your Email",
  html: `
    <h2>Welcome to Cattle Classifier</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>This OTP will expire in 5 minutes.</p>
  `,
});
console.log(JSON.stringify(response, null, 2));


    res.status(201).json({
      success: true,
      message: "OTP sent to your email",
      email,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Signup failed",
    });
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
    console.log(error);
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

    // Agar user Google wala hai toh use manual login mat karne do
    if (user.authProvider === "google") {
      return res.status(400).json({
        error: "Please login using Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // JWT token generate karo
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Production security check for cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      path: "/",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 din
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
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
};

// =============================================================================
// 4. GOOGLE ONE-TAP / SIGN-IN LOGIC
// =============================================================================
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    // Google Token verify karo
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Agar naya user hai toh create karo (Google users are auto-verified)
      user = await User.create({
        fullName: name,
        email,
        googleId: sub,
        authProvider: "google",
        isVerified: true,
      });
    } else if (!user.googleId) {
      // Agar account pehle manual bana tha par ab Google se aa raha hai, toh update kar do
      user.googleId = sub;
      user.isVerified = true;
      user.authProvider = "google";
      await user.save();
    }

    // JWT Token generate karo session ke liye
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
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
    console.log(error);
    res.status(500).json({ error: "Google login failed" });
  }
};


// =============================================================================
// 5. Forget-Password
// =============================================================================

export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;
    user.otpExpiry =
      Date.now() + 5 * 60 * 1000;

    await user.save();
await resend.emails.send({
  from: "onboarding@resend.dev",
  to: email,
  subject: "Reset Password OTP",
  html: `
    <h2>Password Reset</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>Valid for 5 minutes</p>
  `,
});


    return res.json({
      success: true,
      message:
        "Password reset OTP sent",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: "Failed to send OTP",
    });
  }
};

// =============================================================================
// 5.Reset Password
// =============================================================================


export const resetPassword = async (req, res) => {
  try {

    const {
      email,
      otp,
      password,
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    if (
      !user.otpExpiry ||
      user.otpExpiry.getTime() <
        Date.now()
    ) {
      return res.status(400).json({
        error: "OTP expired",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.json({
      success: true,
      message:
        "Password reset successful",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: "Password reset failed",
    });
  }
};






// =============================================================================
// 5. USER LOGOUT
// =============================================================================
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};