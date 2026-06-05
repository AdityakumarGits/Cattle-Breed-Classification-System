import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(
  "/auth/verify-otp",
  {
    email,
    otp,
  }
);

     toast.success(res.data.message);
      navigate("/login");

    } catch (err) {
     toast.error(
     err.response?.data?.message ||
     "Verification failed"
  );
}
     finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">

        <h1 className="mb-4 text-center text-2xl font-bold text-green-600">
          Verify OTP
        </h1>

        <p className="mb-4 text-center text-gray-600">
          OTP sent to
          <br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6 digit OTP"
            className="mb-4 w-full rounded-md border px-4 py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;