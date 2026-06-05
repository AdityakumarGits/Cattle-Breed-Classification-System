# 🐄 Cattle Breed Classification System

An AI-powered web application that identifies cattle breeds from uploaded images using Deep Learning and Computer Vision techniques.

## 📌 Overview

The Cattle Breed Classification System helps farmers, researchers, and livestock professionals quickly identify cattle breeds from images. Users can upload a cattle image, and the system predicts the breed with confidence scores and detailed breed information.

The project combines Machine Learning, FastAPI, React, Node.js, and MongoDB to deliver a complete full-stack AI solution.

---

## ✨ Features

### 🤖 AI Breed Classification

* Upload cattle images
* Deep Learning based breed prediction
* Confidence score display
* Fast and accurate inference

### 🔐 Authentication System

* Email Signup
* Email OTP Verification
* Email Login
* Google OAuth Login
* JWT Authentication
* Protected Routes
* Secure Logout

### 🔑 Password Security

* Forgot Password
* OTP Based Password Reset
* Password Strength Meter
* Strong Password Suggestions
* Password Visibility Toggle

### 📖 Breed Information

* Detailed breed descriptions
* Classification details
* Breed characteristics

### 📧 Contact System

* Contact form integration
* Email notifications using Nodemailer

### 🎨 User Experience

* Responsive UI
* Mobile Friendly Design
* Smart Authentication Redirects

---

## 🏗️ System Architecture

User Uploads Image
↓
React Frontend
↓
Node.js Backend
↓
FastAPI ML Service
↓
Deep Learning Model
↓
Prediction Result
↓
Breed Information Display

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* Lucide React
* Google OAuth Client
* zxcvbn

### Backend

* Node.js
* Express.js
* JWT
* bcrypt
* Nodemailer
* Google Auth Library
* Cookie Parser
* CORS

### Database

* MongoDB Atlas
* Mongoose

### Machine Learning

* Python
* FastAPI
* TensorFlow
* Computer Vision

### Authentication

* JWT Authentication
* Google OAuth 2.0
* Email OTP Verification

---

## 📂 Project Structure

```bash
Cattle-Classification/
│
├── cattle-frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   └── utils/
│
├── cattle-backend/
│   ├── controller/
│   ├── routes/
│   ├── model/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── ml-model/
│   ├── main.py
│   ├── model/
│   └── prediction/
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/AdityakumarGits/Cattle-Breed-Classification-System
cd cattle-breed-classification
```

### 2. Frontend Setup

```bash
cd cattle-frontend

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

### 3. Backend Setup

```bash
cd cattle-backend

npm install

npm run dev
```

Backend runs on:

```bash
http://localhost:3000
```

---

### 4. FastAPI ML Service

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
PORT=3000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

GOOGLE_CLIENT_ID=your_google_client_id
```

### Frontend (.env)

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🔐 Security Features

* Password Hashing using bcrypt
* JWT Authentication
* Email Verification before Login
* OTP Expiration Validation
* Secure Password Reset
* Google OAuth Authentication
* Strong Password Enforcement
* Protected Routes

---

## 🚀 Future Enhancements

* Prediction History
* User Dashboard
* Saved Breed Reports
* Profile Management
* Admin Dashboard
* Cloud Image Storage
* Model Analytics

---

## 📸 Screenshots

Add screenshots of:

* Home Page
* Login Page
* Signup Page
* OTP Verification
* Prediction Page
* Breed Information Page

---

## 👨‍💻 Author

Aditya Kumar

AI & Full Stack Developer

---

## 📜 License

This project is developed for educational and research purposes.
