
import { useState, useEffect } from "react"; // useEffect add kiya cleanup ke liye
import { Upload, TrendingUp } from "lucide-react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";



const Analyze = () => {
 const navigate=useNavigate();
 
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // Fix: State define ki
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
 

  // Cleanup function: Jab component unmount ho ya preview badle, memory free kare
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation: Check if it's actually an image
    if (!file.type.startsWith("image/")) {
    toast.error("Please upload a valid image file.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null); 
  };

  const handleAnalyze = async () => {
    if (!image) {
     toast.error("Please Upload an Image");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      setResult(null);

    const res = await API.post(
  "/predict",
  formData,
  {
    headers: { "Content-Type": "multipart/form-data" },
  }
);
     
      setResult(res.data);
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.message || "Prediction failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };
  const handleKnowMore=()=>{
    const token=localStorage.getItem("token");
    if(!token){
      toast.error("Please login to see detailed information!")
      navigate("/login");
    }else{
      navigate("/more", { state: { breedName: result.prediction } })
    }
  };

  return (
    <div className="min-h-screen bg-green-50 pt-20 px-4 sm:px-6 md:px-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-900">
            Cattle Breed Detection
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600">
            Upload a cattle image to identify the breed with AI-powered analysis
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">

          {/* Upload Card */}
          <div className="rounded-xl border border-green-200 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg sm:text-xl font-semibold text-green-800">
              <Upload size={18} /> Upload Image
            </h2>

            <label className="relative flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 transition overflow-hidden">
              
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="h-full w-full object-contain" // object-contain better hai breed check karne ke liye
                />
              ) : (
                <div className="text-center p-4">
                   <Upload className="mx-auto text-green-400 mb-2" size={40} />
                   <p className="text-green-700 font-medium">Click to upload image</p>
                   <p className="text-xs text-green-600 mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}

              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleUpload}
              />
            </label>

            <button
              onClick={handleAnalyze}
              disabled={loading || !image}
              className={`mt-4 w-full py-3 rounded-lg font-semibold transition ${
                loading || !image 
                ? "bg-gray-300 cursor-not-allowed" 
                : "bg-green-600 text-white hover:bg-green-700 shadow-md"
              }`}
            >
              {loading ? "Analyzing..." : "Analyze Breed"}
            </button>
          </div>

          {/* Result Card */}
          <div className="rounded-xl border border-green-200 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg sm:text-xl font-semibold text-green-800">
              <TrendingUp size={18} /> Prediction Results
            </h2>

            {loading && (
              <div className="flex flex-col items-center justify-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
                <p className="mt-4 text-green-700">Processing image...</p>
              </div>
            )}

            {!result && !loading && (
              <div className="flex items-center justify-center h-48 border-2 border-dotted border-gray-100 rounded-lg">
                <p className="text-gray-400">Results will appear here</p>
              </div>
            )}

            {result && (
              <div className="animate-in fade-in duration-500">
                <div className="mb-6 p-4 bg-green-600 rounded-lg text-center text-white">
                  <p className="text-sm uppercase tracking-wider opacity-80">Primary Breed</p>
                  <h2 className="text-2xl font-bold">{result.prediction}</h2>
                  <p className="text-xl font-semibold mt-1">
                    {result.confidence.toFixed(1)}%
                   
                  </p>
                </div>

                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Other Matches</h3>
                <div className="space-y-3">
                  {result.top_3?.map((item, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{item.breed}</span>
                        <span className="text-green-600 font-bold">{item.confidence.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
        {result && (
         <div className="flex justify-center mt-8">
         <button 
         onClick={handleKnowMore}
          className="w-52 h-12 font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg transition-all transform hover:scale-105"
        >
       Know More About {result.prediction}
     </button>
  </div>
        )}
        {/* <button className=" justify-center mt-5 text-mb w-52 h-10 font-bold bg-green-400 text-white rounded-lg hover:bg-green-500  ">Know more About Breed</button> */}
      </div>
    </div>
  );
};

export default Analyze;
