import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import API from "../utils/api";
import { Eye, EyeOff } from "lucide-react"; // ✅ EyeOff bhi import kiya
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ 1. State banayi password visibility ke liye

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login Successful");

      const from = location.state?.from || "/";
      navigate(from);
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-green-100 p-6 text-gray-700 shadow-lg transition hover:bg-green-200">
        <h1 className="mb-4 text-center text-2xl font-bold text-green-500 transition hover:text-green-700 hover:underline">
          Login
        </h1>
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label className="mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-transparent px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="relative mb-4">
            <label className="mb-1 block">Password</label>
            <input
              type={showPassword ? "text" : "password"} // ✅ 2. Input type dynamic kiya
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-transparent px-4 py-3 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
              placeholder="Enter your password"
              required
            />
            {/* ✅ 3. Click handler lagaya aur icon badla state ke hisab se */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] cursor-pointer text-gray-500 transition hover:text-gray-800"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="text-right mb-4">
            <Link
              to="/forget-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-4 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await API.post("/auth/google-login", {
                  credential: credentialResponse.credential,
                });

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                toast.success("Google Login Successful ");

                const from = location.state?.from || "/";
                navigate(from);
              } catch (error) {
                console.log(error);
                toast.error("Google Login Failed");
              }
            }}
            onError={() => {
              console.log("Google Login Failed");
            }}
          />
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <p className="text-gray-500">Don't have an account?</p>
          <Link to="/signup" className="text-gray-700 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
