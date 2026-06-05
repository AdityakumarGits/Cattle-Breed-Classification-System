import { useState } from "react";
import API from "../utils/api";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordAnalysis = zxcvbn(password);
  const score = passwordAnalysis.score;

  const strengthData = [
    {
      label: "Very Weak",
      color: "bg-red-500",
      text: "text-red-600",
    },
    {
      label: "Weak",
      color: "bg-orange-500",
      text: "text-orange-600",
    },
    {
      label: "Medium",
      color: "bg-yellow-500",
      text: "text-yellow-700",
    },
    {
      label: "Strong",
      color: "bg-green-500",
      text: "text-green-600",
    },
    {
      label: "Very Strong",
      color: "bg-emerald-600",
      text: "text-emerald-700",
    },
  ];

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (score < 2) {
      toast.error("Please choose a stronger password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/reset-password", {
        email,
        otp,
        password,
      });
      toast.success(res.data.message || "Password reset successful");

      navigate("/login");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.error || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-green-100 p-6 text-gray-700 shadow-lg transition hover:bg-green-200">
        <h1 className="mb-2 text-center text-2xl font-bold text-green-500 hover:text-green-700">
          Reset Password
        </h1>

        <p className="mb-6 text-center text-sm text-gray-600">
          Enter the OTP sent to your email and create a new password.
        </p>

        <form onSubmit={handleResetPassword}>
          {/* Email */}
          <div className="mb-4">
            <label className="mb-1 block">Email</label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-md border border-gray-600 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
            />
          </div>

          {/* OTP */}
          <div className="mb-4">
            <label className="mb-1 block">OTP</label>

            <div className="relative">
              <KeyRound
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter OTP"
                className="w-full rounded-md border border-gray-600 bg-transparent py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
              />
            </div>
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="mb-1 block">New Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-md border border-gray-600 bg-transparent px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Strength Meter */}
          {password && (
            <div className="mb-5">
              <p className="mb-2 text-sm font-medium">Password Strength</p>

              <div className="h-2 w-full rounded bg-gray-300">
                <div
                  className={`h-2 rounded ${strengthData[score].color}`}
                  style={{
                    width: `${(score + 1) * 20}%`,
                  }}
                />
              </div>

              <p className={`mt-2 font-semibold ${strengthData[score].text}`}>
                {strengthData[score].label}
              </p>
            </div>
          )}

          {/* Suggestions */}
          {password && passwordAnalysis.feedback.suggestions.length > 0 && (
            <div className="mb-5 rounded-lg bg-white p-3 text-sm">
              <p className="mb-2 font-semibold">Suggestions</p>

              <ul className="list-disc pl-5 space-y-1">
                {passwordAnalysis.feedback.suggestions.map(
                  (suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ),
                )}
              </ul>
            </div>
          )}

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="mb-1 block">Confirm Password</label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-md border border-gray-600 bg-transparent px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
              />

              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {confirmPassword && password !== confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || score < 2 || password !== confirmPassword}
            className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
