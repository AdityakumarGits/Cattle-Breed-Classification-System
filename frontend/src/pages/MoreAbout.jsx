
import { MoveUp } from "lucide-react";
import { useState } from "react";
import API from "../utils/api";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

const MoreAbout = () => {

const [breed,setBreed]=useState("");
const [result,setResult]=useState("");
const [loading,setLoading]=useState(false);
const[cached,setCached]=useState(false);

const handleSearch=async()=>{
  const cleanBreed = breed.trim();
 if (!cleanBreed) {
  toast.error("Please enter a breed name");
  return;
}

if (loading) return;// Loading ke time dubara click prevent karega   
  try {
     setLoading(true);
      setResult("");
      setBreed("")
      console.log("Sending breed:", cleanBreed)
      const res = await API.post("/info/info", { breed:cleanBreed });
      setResult(res.data.data);
      setCached(res.data.cached || false);

    
  } catch (error) {
  console.error("API Error Details:", error.response?.data);

  toast.error(
    error.response?.data?.error ||
    "Failed to fetch breed information"
  );

  setResult("");
}
  finally{
    setLoading(false);
  }
}
  return (
    



    <div className="min-h-[80vh] w-full max-w-6xl mx-auto mt-16 bg-green-100 rounded-2xl p-10 flex flex-col justify-between shadow-lg">
      
      {/* Heading */}
      <div className="mb-6">
        <p className="text-2xl font-semibold text-gray-800">
          Know More About Breed
        </p>
        <p className="text-sm text-gray-500">
          Enter a breed name to get detailed information
        </p>
      </div>

      {/* Output Box */}
      <div className="flex-1 bg-white rounded-2xl text-black p-5 mb-6 overflow-y-auto">
        
         {loading && (
          <p className="text-blue-500"> Fetching breed information...</p>
         )}

         {
          cached && !loading && (
            <p className="text-green-500 text-sm mb-2"> Fast Result</p>
          )
         }
         {!loading && result && (
          <div className="prose max-w-none" ><ReactMarkdown>{result}</ReactMarkdown>
          </div>
         )}
         {!loading && !result && (
          <p className="text-gray-400"> Breed details will appear here... </p>
          )}
      
      </div>

      {/* Prompt Input */}
      <div className="w-full max-w-4xl mx-auto flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
        <input
          type="text"
          value={breed}
          onChange={(e)=>setBreed(e.target.value)}
          placeholder="Write the breed name..."
          className="w-full bg-transparent text-gray-700 outline-none px-3"
           onKeyDown={(e)=>e.key ==="Enter" && handleSearch()} //Enter key Support
        />

        <button
  onClick={handleSearch}
  disabled={loading}
  className={`flex items-center justify-center w-10 h-10 rounded-full text-white transition ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-500 hover:bg-green-600"
  }`}
></button>
      </div>
    </div>
  );
};

export default MoreAbout;