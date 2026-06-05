import { useLocation } from "react-router-dom";
const Footer = () => {
   const location = useLocation();

  const hideFooterRoutes = [
    "/login",
    "/signup",
    "/verify-otp",
    "/forget-password",
    "/reset-password",
    "/more"
  ];

  if (hideFooterRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
      © 2026 Cattle Breed Classification System
      <br />
      Built with React, Node.js, FastAPI & TensorFlow
    </footer>
  );
};

export default Footer;