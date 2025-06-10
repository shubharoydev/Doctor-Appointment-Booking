# 🩺 Doctor Appointment Booking System

A robust **MERN Stack** web application for managing doctor profiles, scheduling appointments, and delivering seamless healthcare booking experiences. It includes **role-based access**, **OTP authentication**, **image uploads**, **GraphQL API integration**, and performance optimization using **Redis**.

🔗 **Live Demo**: https://doctor-appointment-booking-bice.vercel.app

---

## ✅ Features

* ✅ **Doctor Registration/Login with OTP (Email-based)**
* ✅ **Secure Doctor Signup with Access Code**
* ✅ **User-Friendly Patient Signup (No Code Required)**
* ✅ **Doctor Profile Creation with Cloudinary Image Upload**
* ✅ **Editable Profiles with Specialization, Experience, Fees, Language, and Location**
* ✅ **Dynamic Scheduling for Doctor Availability**
* ✅ **Role-Based Authentication and Authorization**

  * `Doctor`: Manage profile, availability, view appointments
  * `User`: Search doctors, book appointments, view history
* ✅ **Success Email Notification on Appointment Booking**
* ✅ **Dashboard for Appointment History (Doctor & User)**
* ✅ **GraphQL API for Public Doctor Profiles**
* ✅ **Redis Caching** for Optimized Search Performance
* ✅ **Secure Session Handling via JWT (Access + Refresh Tokens)**

---

## 🛠 Tech Stack

* **Frontend**: [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)
* **Backend**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) + [MongoDB](https://www.mongodb.com/)
* **Authentication**: OTP via [Nodemailer](https://nodemailer.com/), JWT-based auth
* **Image Upload**: [Cloudinary](https://cloudinary.com/)
* **API Integration**: [GraphQL](https://graphql.org/) for public profile queries
* **Caching**: [Redis](https://redis.io/) for enhanced speed and efficiency

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shubharoydev/Doctor-Appointment-Booking.git
cd Doctor-Appointment-Booking
```

---

### 2️⃣ Configure Environment Variables

#### 📁 Backend `.env`

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=your_mongodb_uri
PORT=5000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

REDIS_URL=your_redis_instance_url
GRAPHQL_API=your_graphql_api_url
```

#### 📁 Frontend `.env`

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🚀 Running the Application

### ▶️ Start Backend

```bash
cd backend
npm install
npm run dev
```

### ▶️ Start Frontend

```bash
cd frontend
npm install
npm run dev
```

* Frontend runs at: `http://localhost:5173`
* Backend runs at: `http://localhost:5000`

---

## 📁 Project Structure

```
/Doctor-Appointment-Booking 
│── /backend
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── graphql/
│── /frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│── .gitignore
│── README.md
│── package.json
```

---

## ☁️ Deployment

* **Backend**: Deploy on [Render](https://render.com/) or [Vercel](https://vercel.com/)
* **Frontend**: Deploy on [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/)

> ⚠️ Make sure to configure your environment variables correctly in the deployment settings.

---

## 📧 Email Notifications

* **OTP Login**: An OTP is sent to the user's email for authentication using **Nodemailer**.
* **Appointment Confirmation**: A confirmation email is automatically triggered after a successful appointment booking.

---

## 🔐 Authentication & Access Control

* 🔑 **JWT (Access & Refresh Tokens)** for secure session handling
* 📩 **OTP-based Signup** via email 
* 🔒 **Doctor Registration Requires Access Code**
* 👤 **User Registration Without Access Code**
* 🧑‍⚕️ **Doctor Dashboard** to manage profile, availability, and appointments
* 👨‍💻 **User Dashboard** to book and view appointments

---

## ⚡ Performance Optimization

* ⚙️ **GraphQL API** enables efficient doctors public profile querying
* 🚀 **Redis Caching** enhances doctor search speed and reduces load on the database

---

Feel free to fork, contribute, or raise issues!
📫 For any queries or feedback, contact: **[shubharoy0024@gmail.com](mailto:shubharoy0024@gmail.com)**


