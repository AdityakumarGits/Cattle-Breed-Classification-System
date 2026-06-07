import Breed from "../model/breed.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

 const getBreedInfo= async (req,res)=>{
    try {
         const {breed}= req.body;
         if (!breed) {
        return res.status(400).json({ error: "Breed is required" });
    }
      ////convert breed in lowercase
        const normalizedBreed = breed.toLowerCase().trim();
    
        //check Cache in db  if(breed detail present  in Db  to db se hi response chala jayega  Api call nhi Hoga )
          const existing =await Breed.findOne({breed:normalizedBreed})

         if(existing){
            return res.json({
                success:true,
                breed:breed,
                data:existing.response,
                cached:true, //important for debugging
            });
         }

         
       //Call Gemini Api 
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Give short detailed information about ${breed} cattle breed including origin, characteristics, milk production, and uses.`;
          
          // Generate content
        const result = await model.generateContent(prompt);
       // const response = await result.response;
        const text = result.response.text();


        //Save The breed Detail In database
        await Breed.create({
            userId:req.user.id, //auth user
            breed:normalizedBreed,
            response: text,
        });
         //send Response to User (frontend)
        res.json({ 
            success: true, 
            breed: breed,
            data: text,
            cached:false, 
        });
        } catch (error) {
             // Ye line terminal (VS Code) mein check karein, exact error dikhega
          console.error("DETAILED ERROR:", error); 
    
        res.status(500).json({ 
        error: "Failed to fetch breed info", 
        details: error.message // Debugging ke liye message bhi bhej dein
    })
}
 };

export default getBreedInfo;