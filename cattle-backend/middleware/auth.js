import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    // const token = req.cookies.token;
    // Header se token nikalna (format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log("No token found in cookies"); // Debugging ke liye
     return res.status(401).json({ error: "Unauthorized: Please login first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
   return res.status(401).json({ error: "Session expired or invalid token" });
  }
};