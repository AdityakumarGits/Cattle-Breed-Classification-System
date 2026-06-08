
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import zxcvbn from "zxcvbn"; 
import { toast } from "react-hot-toast";


const strengthData = [
  { label: "Very Weak ", color: "bg-red-500" },
  { label: "Weak ", color: "bg-orange-500" },
  { label: "Medium ", color: "bg-yellow-500" },
  { label: "Strong ", color: "bg-blue-500" },
  { label: "Very Strong ", color: "bg-green-500" },
];

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
   
  // ✅ Safely analyze password analysis inside the render flow
  const passwordAnalysis = zxcvbn(password);
  const score = passwordAnalysis.score;

  // 1. Manual Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
    toast.error("Please fill all fields ");
      return;
    }

  if (score < 2) {
  toast.error(
    "Please choose a stronger password"
  );
  return;
}

    try {
      setLoading(true);
      const res = await API.post(
  "/api/auth/signup",
  {
    fullName,
    email,
    password,
  }
);
      
      toast.success(res.data.message);
      if (res.status === 201) {
        localStorage.setItem("verificationEmail", email);
        navigate("/verify-otp", {
          state: { email },
        });
      }
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // 2. Google Login Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      
      // Backend ke google endpoint par credential token bhej rahe hain
     const res = await API.post(
  "/api/auth/google-login",
  {
    credential: credentialResponse.credential,
  }
);

      if (res.data.success) {
  localStorage.setItem(
    "token",
    res.data.token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(res.data.user)
  );

  toast.success(
    "Google Authentication Successful"
  );

  navigate("/");
}
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.error || "Google Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In was unsuccessful. Try again later.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-green-100 p-6 text-gray-700 shadow-lg hover:bg-green-200 transition">
        <h1 className="mb-4 text-center text-2xl font-bold text-green-500 hover:text-green-700 hover:underline transition">
          Signup
        </h1>
        
        {/* FORM START */}
        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-transparent px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-transparent px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-transparent px-4 py-3 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
              placeholder="Enter your password"
            />
            
            {/* Dynamic Password Strength Bar Rendering */}
            {password && (
              <div className="mt-3">
                <div className="h-2 w-full rounded bg-gray-300 overflow-hidden">
                  <div
                    className={`h-2 rounded transition-all duration-300 ${strengthData[score].color}`}
                    style={{
                      width: `${(score + 1) * 20}%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-sm font-semibold">
                  Strength: {strengthData[score].label}
                </p>
              </div>
            )}
            
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] cursor-pointer text-gray-500 hover:text-gray-800 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-3 font-semibold text-white transition mb-4 ${
              loading ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
        {/* FORM END */}

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        {/* Google Login Button Container */}
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline" // Fixed: Applied valid custom Google layout theme
            size="large"
            text="continue_with"
            shape="rectangular"
            width="384px"
          />
        </div>

        <div className="mt-4 flex justify-between text-sm">
          <p className="text-gray-500">Already registered</p>
          <Link to="/login" className="text-gray-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;