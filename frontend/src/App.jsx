import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "./component/Layout";
import Analyze from "./pages/Analyze";
import Home from "./component/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MoreAbout from "./pages/MoreAbout";
import Contact from "./pages/Contact";
import ProtectedRoute from "./component/ProtectedRoutes";
import VerifyOTP from "./pages/VerifyOTP";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <>
      <Routes>
          <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forget-password" element={<ForgetPassword />}/>
          <Route path="/reset-password" element={<ResetPassword />}/>
          <Route path="/more"  element={<ProtectedRoute><MoreAbout /></ProtectedRoute>}/>
          <Route path="/contact" element={<Contact />} /></Route>
          <Route path="*" element={<NotFound />} />
      </Routes>


    <Toaster  position="top-center"  reverseOrder={false}
      />
    </>
  );
};

export default App;