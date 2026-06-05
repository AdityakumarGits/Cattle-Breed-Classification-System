import fs from "fs";
import axios from "axios";
import FormData from "form-data";

export const predictImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    
    console.log("File received:", file.filename);
    
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.path));

    // Send to Python FastAPI Model
    const response = await axios.post(
      "http://127.0.0.1:8000/api/predict",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    // Send AI results back to React
    return res.status(200).json(response.data);

  } catch (error) {
    console.error("Node Error:", error.message);
    console.error("FastAPI Error:", error?.response?.data);

    return res.status(500).json({ 
        message: "Server Error: Failed to analyze breed",
        details: error?.response?.data || error.message
    });

  } finally {
    // CRITICAL FIX: This runs no matter what. 
    // It guarantees the temp image is deleted even if the ML model crashes!
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log("Cleaned up temporary file:", req.file.filename);
    }
  }
};