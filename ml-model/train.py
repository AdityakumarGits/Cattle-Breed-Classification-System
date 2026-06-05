
import tensorflow as tf
from tensorflow.keras import layers, models, optimizers, callbacks, regularizers
from tensorflow.keras.preprocessing import image_dataset_from_directory

# 1. Configuration
IMG_SIZE = (224, 224)
BATCH_SIZE = 16 
DATA_DIR = r"dataset/Cattle Breeds" # Matches your new screenshot

# 2. Randomly Split Data (80% Train, 20% Validation)
# The 'seed' ensures that if you run it again, the split stays the same
train_ds = image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='categorical'
)

val_ds = image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='categorical'
)

# 3. Data Augmentation
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.2),
    layers.RandomZoom(0.2),
    layers.RandomContrast(0.2),
])

# 4. Model Architecture (B0)
base_model = tf.keras.applications.EfficientNetB0(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base_model.trainable = False 

model = models.Sequential([
    layers.Input(shape=(224, 224, 3)),
    data_augmentation,
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.BatchNormalization(),
    layers.Dense(256, activation='relu', kernel_regularizer=regularizers.l2(0.01)),
    layers.Dropout(0.6), # Your 0.6 Dropout
    layers.Dense(5, activation='softmax')
])

# 5. Compile & Train
model.compile(
    optimizer=optimizers.Adam(learning_rate=1e-3),
    loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
    metrics=['accuracy']
)

# Callbacks
early_stop = callbacks.EarlyStopping(monitor='val_accuracy', patience=7, restore_best_weights=True)
reduce_lr = callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3)

print("--- Starting Training with Random Split ---")
model.fit(train_ds, validation_data=val_ds, epochs=25, callbacks=[early_stop, reduce_lr])

# 6. Fine-Tuning (Optional but recommended if accuracy is near 85%)
base_model.trainable = True
for layer in base_model.layers[:-40]:
    layer.trainable = False

model.compile(optimizer=optimizers.Adam(learning_rate=1e-5), 
              loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
              metrics=['accuracy'])

print("--- Starting Fine-Tuning ---")
model.fit(train_ds, validation_data=val_ds, epochs=15, callbacks=[early_stop, reduce_lr])

model.save('cattle_model.h5')