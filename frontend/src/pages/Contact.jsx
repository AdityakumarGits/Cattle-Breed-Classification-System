import { useState } from "react";
import API from "../utils/api";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/api/contact", formData);
      toast.success(res.data.message || "Message sent successfully");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    }catch (error) { 
      console.error(error);
      toast.error(
        error.response?.data?.error || "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 pt-24 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-green-600 mb-3">Contact Us</h2>

          <p className="text-gray-600 mb-6">
            Have questions about cattle breed classification? We'd love to hear
            from you.
          </p>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <Mail className="text-green-600" />
              <span>support@cattleclassifier.ai</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-green-600" />
              <span>+91 XXXXXXXXXX</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-green-600" />
              <span>India (Remote Team)</span>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-green-100 text-green-700 text-sm">
            🚀 Our AI model helps farmers and researchers identify cattle breeds
            instantly with high accuracy.
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Send us a message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Message</label>

              <textarea
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-600 text-white font-semibold py-3 hover:bg-green-700 transition disabled:bg-green-400"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
