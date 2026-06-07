import axios from "axios";
import FormData from "form-data";

export const predictImage = async (req, res) => {
  try {
    const file = req.file;

    // 1. Check agar file upload nahi hui hai
    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    
    // 2. FormData create karein (Memory Buffer se read karne ke liye)
    const formData = new FormData();
    
    // 👈 FIX: fs.createReadStream ki jagah file.buffer use kar rahe hain jo Vercel/Render ke liye safe hai
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    // 3. ML Model URL Setup
    // 👈 FIX: Hugging Face ka live URL .env se aayega, nahi toh fallback local port 5000 par hoga
    // Aur endpoint sahi kiya: /api/predict (kyunki aapke Python code me /api/predict hai)
    const mlUrl = process.env.ML_MODEL_URL || 'http://localhost:5000/api/predict';

    console.log(`Sending image to ML Model at: ${mlUrl}`);

    // 4. FastAPI Server ko request bhejein
    const response = await axios.post(mlUrl, formData, {
      headers: formData.getHeaders(),
    });

    console.log("ML Response:", response.data);

    // 5. Result React frontend ko wapas bhejein
    return res.status(200).json(response.data);

  } catch (error) {
    console.error("Node Error:", error.message);
    console.error("FastAPI Error:", error?.response?.data);

    return res.status(500).json({ 
        message: "Server Error: Failed to analyze breed",
        details: error?.response?.data || error.message
    });
  }
  // 👈 FIX: Ab 'finally' block aur fs.unlinkSync ki zaroorat nahi hai!
  // Kyunki file disk (uploads folder) par write hi nahi hui, direct RAM (buffer) se process ho gayi.
};