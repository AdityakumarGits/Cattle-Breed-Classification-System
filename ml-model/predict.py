
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import os

# 1. Load the model you just trained
MODEL_PATH = 'cattle_model.h5'
model = tf.keras.models.load_model(MODEL_PATH)

# 2. Define the Breed Names (Must be in alphabetical order)
class_names = ['Ayrshire cattle', 'Brown Swiss cattle', 'Holstein Friesian cattle', 'Jersey cattle', 'Red Dane cattle']

def predict_cattle_breed(img_path):
    if not os.path.exists(img_path):
        print("Error: Image path does not exist.")
        return

    # 3. Preprocess the image
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Create batch axis
    
    # EfficientNet normalization is handled inside the model layers 
    # but we ensure it's treated as a float32 array
    img_array = img_array.astype('float32')

    # 4. Run Prediction
    predictions = model.predict(img_array)
    
    # Get the index of the highest score
    result_index = np.argmax(predictions[0])
    breed = class_names[result_index]
    confidence = predictions[0][result_index] * 100

    print("-" * 30)
    print(f"Prediction: {breed}")
    print(f"Confidence: {confidence:.2f}%")
    print("-" * 30)

# --- TEST IT HERE ---
# Replace 'test_image.jpg' with a path to a real image in your folder
# Example: predict_cattle_breed(r'dataset/Cattle Breeds/Jersey cattle/image_1.jpg')

if __name__ == "__main__":
    path = input("Enter the path to the cattle image: ")
    predict_cattle_breed(path)