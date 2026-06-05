
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { House, Contact, Upload, Key, CircleGauge, Menu, X } from "lucide-react";
import API from "../utils/api";
import { useLocation } from "react-router-dom";

const Navbar = () => {

   const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
    const hideNavbarRoutes = [
    "/login",
    "/signup",
    "/forget-password",
    "/reset-password",
     "/verify-otp",
  ];
  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
    
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 backdrop-blur bg-white/90">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-xl font-bold text-white">
            CC
          </div>
          <h1 className="text-lg sm:text-xl font-bold">Cattle-Classifier</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 text-gray-600 md:flex">
          <Link to="/" className="flex items-center gap-1 hover:text-green-700">
            <House size={18} /> Home
          </Link>

          <Link to="/analyze" className="flex items-center gap-1 hover:text-green-700">
            <Upload size={18} /> Analyze
          </Link>

          <Link className="flex items-center gap-1 hover:text-green-700">
            <CircleGauge size={18} /> Analytics
          </Link>

          <Link to="/contact" className="flex items-center gap-1 hover:text-green-700">
            <Contact size={18} /> Contact
          </Link>

          {/*  Auth UI */}
          {user ? (
            <button
              onClick={handleLogout}
                
              className="flex items-center gap-1 cursor-pointer text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="flex items-center gap-1  hover:text-green-700">
              <Key size={18} /> Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="flex flex-col gap-4 p-4 text-gray-700">

            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/analyze" onClick={() => setOpen(false)}>Analyze</Link>
            <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="text-red-500 text-left"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
