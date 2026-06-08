# 🐄 AI-Powered Cattle Breed Classification & Livestock Management System

An intelligent full-stack web application that uses **Deep Learning, Computer Vision, and Cloud Technologies** to identify cattle breeds from images and provide detailed breed information. The system helps farmers, livestock owners, researchers, and agricultural professionals make data-driven decisions regarding livestock management.

---
## 🌐 Live Demo

**Web Application:**
🔗 https://cattle-breed-classification-system.vercel.app/

Experience real-time cattle breed classification by uploading an image and receiving AI-powered predictions, confidence scores, and detailed breed information instantly.

---


## 📌 Overview

Traditional cattle breed identification relies on manual inspection, which can be inaccurate and time-consuming. This project automates the process using an AI-powered image classification model integrated with a modern MERN stack application.

Users can upload or capture cattle images and receive:

* Breed Prediction
* Confidence Score
* Top-3 Breed Matches
* Detailed Breed Information
* Secure User Dashboard

The application combines **React, Node.js, Express, MongoDB Atlas, FastAPI, and EfficientNetB0** to deliver a scalable and production-ready AI solution.

---

## ✨ Features

### 🤖 AI Breed Classification

* Upload cattle images
* Camera capture support
* Deep Learning-based breed prediction
* Confidence score visualization
* Top-3 breed predictions
* Fast and accurate inference

### 🔐 Authentication & Security

* Email Signup
* OTP Email Verification
* Secure Login & Logout
* JWT Authentication
* Protected Routes
* Forgot Password
* Password Reset via OTP

### 📖 Breed Information System

* Detailed breed descriptions
* Milk production information
* Breed characteristics
* Livestock insights and management data

### 📧 Contact & Feedback

* Contact form integration
* User feedback management
* Database storage for support requests

### ☁️ Cloud Deployment

* Frontend hosted on Vercel
* Backend hosted on Render
* MongoDB Atlas database
* FastAPI ML service deployment

---

## 🏗️ System Architecture

```text
User Uploads Image
        │
        ▼
 React Frontend
        │
        ▼
 Node.js Backend
        │
        ▼
 FastAPI ML Service
        │
        ▼
 EfficientNetB0 CNN
        │
        ▼
 Prediction Result
        │
        ▼
 Breed Information Display
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* React Markdown
* Lucide React

### Backend

* Node.js
* Express.js
* JWT Authentication
* Cookie Parser
* Multer
* CORS
* Brevo SMTP

### Database

* MongoDB Atlas
* Mongoose

### Machine Learning

* Python
* FastAPI
* TensorFlow / Keras
* EfficientNetB0
* Computer Vision

### Deployment

* Vercel
* Render
* MongoDB Atlas
* Hugging Face Spaces 

---

## 📂 Project Structure

```bash
Cattle-Breed-Classification-System/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── services/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   └── server.js
│
├── ml-model/
│   ├── main.py
│   ├── predict.py
│   └── model/
│
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/AdityakumarGits/Cattle-Breed-Classification-System.git

cd Cattle-Breed-Classification-System
```

### 2️⃣ Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

### 3️⃣ Backend Setup

```bash
cd backend

npm install

npm start
```

Backend runs on:

```bash
http://localhost:5000
```

### 4️⃣ ML Service Setup

```bash
cd ml-model

pip install -r requirements.txt

uvicorn main:app --reload
```

ML Service runs on:

```bash
http://localhost:8000
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

ML_MODEL_URL=your_ml_service_url

BREVO_EMAIL=your_email

BREVO_PASSWORD=your_password
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

---

## 🔐 Security Features

* JWT Authentication
* Password Hashing
* OTP Verification
* Protected Routes
* Secure Password Reset
* Input Validation
* CORS Protection
* Secure Cookie Handling

---

## 🚀 Challenges Solved

### Memory-Based File Processing

Implemented:

```javascript
multer.memoryStorage()
```

to avoid cloud deployment issues caused by ephemeral file systems.

### Cross-Origin Communication

Configured advanced CORS policies to support communication between Vercel and Render deployments.

### React SPA Routing Fix

Implemented Vercel rewrite rules to prevent 404 errors on page refresh.

### Secure Email Delivery

Integrated Brevo SMTP for OTP verification and password recovery workflows.

---

## 🚀 Future Enhancements

* Livestock Health Detection
* Disease Prediction
* Prediction History
* User Dashboard
* Mobile Application
* IoT Smart Farm Integration
* Blockchain-Based Animal Identity Tracking
* Milk Yield Prediction

---

## 📸 Screenshots

Add screenshots for:

* Home Page
* Login Page
* Signup Page
* OTP Verification
* Breed Prediction Page
* Breed Information Page
* Contact Page

---

## 👨‍💻 Author

**Aditya Kumar**

MERN Stack Developer | AI Enthusiast | Applied Machine Learning Developer

---

## 📜 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it for educational and research purposes.
