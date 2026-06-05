
import { ArrowRight } from "lucide-react";
import cow from "../assets/cow.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate=useNavigate();
  return (
    <div className="bg-green-50 pt-20">
      <div className="mx-auto grid min-h-[85vh] max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-2">

        {/* Left Side */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            AI-Powered
          </h1>

          <span className="block text-3xl font-bold leading-tight text-green-600 sm:text-4xl md:text-5xl">
            Cattle Breed Classification
          </span>

          <p className="mx-auto mb-6 mt-4 max-w-lg text-base sm:text-lg text-gray-600 md:mx-0">
            Upload cattle images and instantly get breed classification and
            health insights using our machine learning model.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
            <button onClick={() => navigate("/analyze")} className="flex h-11 sm:h-12 items-center justify-center gap-2 rounded-md bg-green-600 px-5 sm:px-6 text-base sm:text-lg font-bold text-white transition hover:bg-green-700">
              Analyze Breed <ArrowRight size={18} />
            </button>

            <button
                onClick={() => navigate("/more")} 
            className="flex h-11 sm:h-12 items-center justify-center gap-2 rounded-md border border-green-600 px-5 sm:px-6 text-base sm:text-lg font-bold text-green-700 transition hover:bg-green-100">

              Search About Breed <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative flex justify-center">
          <img
            src={cow}
            alt="Cattle Breed"
            className="w-64 sm:w-72 md:w-96 max-w-full rounded-full border border-green-100 shadow-xl transition hover:shadow-2xl"
          />
        </div>

      </div>
    </div>
  );
};

export default Hero;