from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import traceback

app = FastAPI()

# ------------------ CORS ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React localhost allowed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Load Model ------------------
MODEL_PATH = "cattle_model.h5"

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(" Model Loaded Successfully")
except Exception as e:
    print(" Model Loading Failed")
    print(traceback.format_exc())
    model = None

# ------------------ Class Names ------------------
class_names = [
    'Ayrshire cattle',
    'Brown Swiss cattle',
    'Holstein Friesian cattle',
    'Jersey cattle',
    'Red Dane cattle'
]

# ------------------ Image Preprocessing ------------------
def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))

    img_array = np.array(image)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array.astype("float32")

    return img_array

# ------------------ API Route ------------------
@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):

    if model is None:
        return {"error": "Model not loaded properly"}

    try:
        contents = await file.read()

        # Preprocess
        img_array = preprocess_image(contents)

        # Prediction
        predictions = model.predict(img_array)

        # Top prediction
        result_index = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][result_index] * 100)
        breed = class_names[result_index]

        # Top 3 predictions
        top_3_indices = predictions[0].argsort()[-3:][::-1]

        top_3 = []
        for i in top_3_indices:
            top_3.append({
                "breed": class_names[i],
                "confidence": float(predictions[0][i] * 100)
            })

        return {
            "prediction": breed,
            "confidence": confidence,
            "top_3": top_3
        }

    except Exception as e:
        print(traceback.format_exc())
        return {"error": "Prediction failed"}