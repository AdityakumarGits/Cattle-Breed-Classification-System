import axios from "axios";
import FormData from "form-data";

export const predictImage = async (req, res) => {
  try {
    const file = req.file;

    // 1. Safe check: Agar frontend se galat key aayi ya file missing hui
    if (!file) {
      return res.status(400).json({ error: "No image file received. Make sure form-data key name is 'file'" });
    }
    
    const formData = new FormData();
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const mlUrl = process.env.ML_MODEL_URL || 'http://localhost:5000/api/predict';
    console.log(`Sending image to ML Model at: ${mlUrl}`);

    const response = await axios.post(mlUrl, formData, {
      headers: formData.getHeaders(),
    });

    console.log("ML Response:", response.data);
    return res.status(200).json(response.data);

  } catch (error) {
    console.error("Node Error:", error.message);
    return res.status(500).json({ 
        error: "Server Error: Failed to analyze breed",
        details: error?.response?.data || error.message
    });
  }
};