const handleAnalyze = async () => {
    if (!image) {
      toast.error("Please Upload an Image");
      return;
    }

    const formData = new FormData();
    formData.append("file", image); // 🚀 Key name strictly matching backend Multer upload.single("file")

    try {
      setLoading(true);
      setResult(null);

      const res = await API.post(
        "/api/predict",
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data" 
          },
        }
      );
      
      setResult(res.data);
      toast.success("Analysis Completed successfully!"); // User experience enhance karne ke liye
    } catch (error) {
      console.error("API Error Detailed:", error);
      
      // 🚀 FIX: Backend response keys (.error ya .message) dono ko properly handle kiya
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Prediction failed. Check backend connection.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };