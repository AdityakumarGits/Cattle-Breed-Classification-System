// import User from "../model/user.model.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import resend from "../config/mail.js";
// import { OAuth2Client } from "google-auth-library";

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // =============================================================================
// // 1. USER SIGNUP (MANUAL WITH OTP)
// // =============================================================================
// export const signup = async (req, res) => {
//   try {
//     const { fullName, email, password } = req.body;

//     // Check karo user already exists or not
//     const exitsUser = await User.findOne({ email });
//     if (exitsUser) {
//       return res.status(400).json({
//         error: "User already Exists ",
//       });
//     }
//     //strong password
//    const strongPassword =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// if (!strongPassword.test(password)) {
//   return res.status(400).json({
//     error:
//       "Password must contain uppercase, lowercase, number and special character",
//   });
// }
//     // Password hash karo
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Naya user create karo (isVerified: false hoga jab tak OTP enter na kare)
//     await User.create({
//       fullName,
//       email,
//       password: hashedPassword,
//       otp,
//       otpExpiry: Date.now() + 5 * 60 * 1000,
//       isVerified: false,
//       authProvider: "local" // Default local auth
//     });

//     // Verification OTP Send karo
//    const response = await resend.emails.send({
//   from: "onboarding@resend.dev",
//   to: email,
//   subject: "Verify Your Email",
//   html: `
//     <h2>Welcome to Cattle Classifier</h2>
//     <p>Your OTP is:</p>
//     <h1>${otp}</h1>
//     <p>This OTP will expire in 5 minutes.</p>
//   `,
// });
// console.log("Resend API Response:", JSON.stringify(response, null, 2));


//     res.status(201).json({
//       success: true,
//       message: "OTP sent to your email",
//       email,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: "Signup failed",
//     });
//   }
// };

// // =============================================================================
// // 2. USER OTP VERIFICATION
// // =============================================================================
// export const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (!user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     user.isVerified = true;
//     user.otp = null;
//     user.otpExpiry = null;
//     await user.save();

//     res.json({
//       success: true,
//       message: "Email verified successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Verification failed" });
//   }
// };

// // =============================================================================
// // 3. USER LOGIN (MANUAL)
// // =============================================================================
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: "Invalid User or Password" });
//     }

//     if (!user.isVerified) {
//       return res.status(403).json({
//         success: false,
//         message: "Please verify your email first",
//       });
//     }

//     // Agar user Google wala hai toh use manual login mat karne do
//     if (user.authProvider === "google") {
//       return res.status(400).json({
//         error: "Please login using Google",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     // JWT token generate karo
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     // Production security check for cookie
//     const isProduction = process.env.NODE_ENV === "production";

// res.cookie("token", token, {
//   httpOnly: true,
//   secure: isProduction ? true : false, 
//   sameSite: isProduction ? "none" : "lax", // Localhost ke liye lax, cloud ke liye none
//   path: "/",
//   maxAge: 1 * 24 * 60 * 60 * 1000,
// });
//     res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//       },
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Login failed" });
//   }
// };

// // =============================================================================
// // 4. GOOGLE ONE-TAP / SIGN-IN LOGIC
// // =============================================================================
// export const googleLogin = async (req, res) => {
//   try {
//     const { credential } = req.body;

//     // Google Token verify karo
//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, sub } = payload;

//     let user = await User.findOne({ email });

//     if (!user) {
//       // Agar naya user hai toh create karo (Google users are auto-verified)
//       user = await User.create({
//         fullName: name,
//         email,
//         googleId: sub,
//         authProvider: "google",
//         isVerified: true,
//       });
//     } else if (!user.googleId) {
//       // Agar account pehle manual bana tha par ab Google se aa raha hai, toh update kar do
//       user.googleId = sub;
//       user.isVerified = true;
//       user.authProvider = "google";
//       await user.save();
//     }

//     // JWT Token generate karo session ke liye
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//    const isProduction = process.env.NODE_ENV === "production";

// res.cookie("token", token, {
//   httpOnly: true,
//   secure: isProduction ? true : false, 
//   sameSite: isProduction ? "none" : "lax", // Localhost ke liye lax, cloud ke liye none
//   path: "/",
//   maxAge: 1 * 24 * 60 * 60 * 1000,
// });

//     res.json({
//       success: true,
//       message: "Google Login successful",
//       token,
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//       },
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Google login failed" });
//   }
// };


// // =============================================================================
// // 5. Forget-Password
// // =============================================================================

// export const forgotPassword = async (req, res) => {
//   try {

//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         error: "User not found",
//       });
//     }

//     const otp = Math.floor(
//       100000 + Math.random() * 900000
//     ).toString();

//     user.otp = otp;
//     user.otpExpiry =
//       Date.now() + 5 * 60 * 1000;

//     await user.save();
// await resend.emails.send({
//   from: "onboarding@resend.dev",
//   to: email,
//   subject: "Reset Password OTP",
//   html: `
//     <h2>Password Reset</h2>
//     <p>Your OTP is:</p>
//     <h1>${otp}</h1>
//     <p>Valid for 5 minutes</p>
//   `,
// });


//     return res.json({
//       success: true,
//       message:
//         "Password reset OTP sent",
//     });

//   } catch (error) {

//     console.log(error);

//     return res.status(500).json({
//       error: "Failed to send OTP",
//     });
//   }
// };

// // =============================================================================
// // 5.Reset Password
// // =============================================================================


// export const resetPassword = async (req, res) => {
//   try {

//     const {
//       email,
//       otp,
//       password,
//     } = req.body;

//     const user =
//       await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         error: "User not found",
//       });
//     }

//     if (user.otp !== otp) {
//       return res.status(400).json({
//         error: "Invalid OTP",
//       });
//     }

//     if (
//       !user.otpExpiry ||
//       user.otpExpiry.getTime() <
//         Date.now()
//     ) {
//       return res.status(400).json({
//         error: "OTP expired",
//       });
//     }

//     const hashedPassword =
//       await bcrypt.hash(password, 10);

//     user.password = hashedPassword;
//     user.otp = null;
//     user.otpExpiry = null;

//     await user.save();

//     return res.json({
//       success: true,
//       message:
//         "Password reset successful",
//     });

//   } catch (error) {

//     console.log(error);

//     return res.status(500).json({
//       error: "Password reset failed",
//     });
//   }
// };






// // =============================================================================
// // 5. USER LOGOUT
// // =============================================================================
// export const logout = (req, res) => {
//   try {
//     const isProduction = process.env.NODE_ENV === "production";

//     // res.clearCookie direct cookie ko browser se delete kar deta hai
//     res.clearCookie("token", {
//       httpOnly: true,
//       secure: isProduction, // production me true, local me false
//       sameSite: isProduction ? "none" : "lax",
//       path: "/",
//     });

//     res.json({
//       success: true,
//       message: "Logout successful",
//     });
//   } catch (error) {
//     console.log("Logout Error:", error);
//     res.status(500).json({ error: "Logout failed" });
//   }
// };



import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"; // 🚀 FIX: Resend hata kar Nodemailer use kiya taaki bina domain ke sabhi ko mail jaye
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// =============================================================================
// GLOBALLY INITIALIZED NODEMAILER TRANSPORTER (PORT 465 FOR PRODUCTION)
// =============================================================================
// Secure Port 465 use kiya hai taaki Render (Cloud) par connection timeout (ETIMEDOUT) na ho
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,            // 🔒 Secure SSL port
  secure: true,         // Port 465 ke liye hamesha true rahega
  auth: {
    user: process.env.EMAIL_USER, // Render variables se aapka email uthayega (cattlebreedhelp@gmail.com)
    pass: process.env.EMAIL_PASS, // Google Account se generate kiya hua 16-digit App Password
  },
  tls: {
    rejectUnauthorized: false // Cloud server network drops aur SSL proxy issues ko bypass karne ke liye
  }
});

// =============================================================================
// 1. USER SIGNUP (MANUAL WITH OTP)
// =============================================================================
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check karo user pehle se register hai ya nahi
    const exitsUser = await User.findOne({ email });
    if (exitsUser) {
      return res.status(400).json({
        error: "User already Exists ",
      });
    }

    // Password strength check karne ke liye Regex formula
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!strongPassword.test(password)) {
      return res.status(400).json({
        error: "Password must contain uppercase, lowercase, number and special character",
      });
    }

    // Security ke liye password ko salt ke sath hash (encrypt) kiya
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 6 digit ka random OTP string banaya
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Database mein entry banayi (isVerified: false rahega jab tak OTP verify na ho)
    await User.create({
      fullName,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, // OTP validity sirf 5 minutes rakhi hai
      isVerified: false,
      authProvider: "local" 
    });

    // 🚀 Nodemailer Secure Email sending flow
    await transporter.sendMail({
      // "Cattle Classifier" display name set kiya jo user ke inbox mein professional dikhega
      from: `"Cattle Classifier" <${process.env.EMAIL_USER}>`, 
      to: email, // Naye registered user ka real email address
      subject: "Verify Your Email - Cattle Classifier",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 500px;">
          <h2 style="color: #16a34a;">Welcome to Cattle Classifier</h2>
          <p>Thank you for registering! Please use the following One-Time Password (OTP) to verify your account:</p>
          <h1 style="color: #1e293b; letter-spacing: 4px; background: #f1f5f9; padding: 10px; text-align: center; border-radius: 6px;">${otp}</h1>
          <p style="color: #64748b; font-size: 14px;">This OTP is valid for 5 minutes only.</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "OTP sent to your email successfully",
      email,
    });

  } catch (error) {
    console.log("Signup Server Error:", error);
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

    // Database se user dhoondo uske email se
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check karo user ka dala hua OTP database ke OTP se match ho raha hai ya nahi
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP ka time limit check karo ki expire toh nahi ho gaya
    if (!user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Agar sab sahi hai toh user status verified true set karo aur OTP fields saaf karo
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

    // Dhoondo ki user exist karta hai ya nahi
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid User or Password" });
    }

    // Agar bina OTP verify kiye direct login try kare toh block karo
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Agar user Google account se register hua hai, toh use manual password se block karo
    if (user.authProvider === "google") {
      return res.status(400).json({
        error: "Please login using Google",
      });
    }

    // Password match check (Bcrypt hashed data ko compare karega)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Login authentic session ke liye JWT token generate kiya (1 din ki validity)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const isProduction = process.env.NODE_ENV === "production";

    // Client security ke liye HTTPOnly secure cookie inject kari
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // Render par HTTPS (true) rahega, local pe false
      sameSite: isProduction ? "none" : "lax", // Cross-site origin blocking handle karne ke liye
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

    // Frontend se aaya hua Google Credential Token verify kiya backend level par
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload; // sub = Unique Google User ID

    let user = await User.findOne({ email });

    if (!user) {
      // Agar ekdum naya user hai toh entry banao (Google accounts trusted hote hain isliye auto-verified=true)
      user = await User.create({
        fullName: name,
        email,
        googleId: sub,
        authProvider: "google",
        isVerified: true,
      });
    } else if (!user.googleId) {
      // Agar user ne pehle manual email se account banaya tha par ab Google Sign-In kiya, toh merge kar do
      user.googleId = sub;
      user.isVerified = true;
      user.authProvider = "google";
      await user.save();
    }

    // Google session complete karne ke liye bhi JWT token assign kiya
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

    // Verify karo ki email register hai bhi ya nahi
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Reset workflow ke liye naya temporary OTP banaya
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // valid for 5 min
    await user.save();

    // 🚀 Nodemailer Secure mail triggering for recovery
    await transporter.sendMail({
      from: `"Cattle Classifier" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password OTP - Cattle Classifier",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 500px;">
          <h2 style="color: #ef4444;">Password Reset Request</h2>
          <p>We received a request to reset your password. Use the code below to complete the setup:</p>
          <h1 style="color: #1e293b; letter-spacing: 4px; background: #fef2f2; padding: 10px; text-align: center; border-radius: 6px; border: 1px solid #fca5a5;">${otp}</h1>
          <p style="color: #64748b; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "Password reset OTP sent to your email",
    });

  } catch (error) {
    console.log("Forgot Password Error:", error);
    return res.status(500).json({
      error: "Failed to send recovery OTP",
    });
  }
};

// =============================================================================
// 6. RESET PASSWORD (SAVE NEW PASSWORD)
// =============================================================================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Check karo recovery OTP sahi hai ya nahi
    if (user.otp !== otp) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    // Recovery OTP expired condition checking
    if (!user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
      return res.status(400).json({
        error: "OTP expired",
      });
    }

    // Naye password ko refresh karke hash (encrypt) kiya database ke liye
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.otp = null; // Token completely clear kiya reset ke baad
    user.otpExpiry = null;
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful. You can log in now.",
    });

  } catch (error) {
    console.log("Reset Password System Error:", error);
    return res.status(500).json({
      error: "Password reset failed",
    });
  }
};

// =============================================================================
// 7. USER LOGOUT (CLEAR SESSIONS)
// =============================================================================
export const logout = (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    // res.clearCookie browser se automatic token value wipe out kar dega
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction, 
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log("Logout System Error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};