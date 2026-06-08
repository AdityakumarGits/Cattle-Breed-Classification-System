import { useState } from "react";
import API from "../utils/api";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";


const ForgotPassword = () => {
 const location = useLocation();
  const navigate = useNavigate();
const [email, setEmail] = useState ( location.state?.email || "");

const [loading, setLoading] = useState(false);



const handleSendOTP = async (e) => {
e.preventDefault();


try {
  setLoading(true);

 const res = await API.post(
  "/api/auth/forgot-password",
  {
    email,
  }
);
  toast.success(res.data.message);
  navigate("/reset-password", {
      state: {
        email,
      },
    });

}catch (error) {
  console.error(error);

  toast.error(
    error.response?.data?.error ||
    "Failed to send OTP"
  );
} 
 finally {
  setLoading(false);
}


};

return ( <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4">


  <div className="w-full max-w-md rounded-xl bg-green-100 p-6 text-gray-700 shadow-lg transition hover:bg-green-200">

    <h1 className="mb-2 text-center text-2xl font-bold text-green-500 hover:text-green-700">
      Forgot Password
    </h1>

    <p className="mb-6 text-center text-sm text-gray-600">
      Enter your registered email address.
      We'll send you an OTP to reset your password.
    </p>

    <form onSubmit={handleSendOTP}>

      <div className="mb-5">
        <label className="mb-1 block">
          Email Address
        </label>

        <div className="relative">

          <Mail
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            className="w-full rounded-md border border-gray-600 bg-transparent py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
          />

        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 disabled:opacity-50"
          
      >
       {loading ? (
  <div className="flex items-center justify-center gap-2">
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
    Sending OTP...
  </div>
) : (
  "Send OTP"
)}
      </button>

    </form>

  </div>
</div>

);
};

export default ForgotPassword;
