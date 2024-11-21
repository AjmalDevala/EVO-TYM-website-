# EVO-TYM 🕰️ | Watch E-Commerce Platform

A full-featured e-commerce website for watch enthusiasts, featuring robust user and admin functionalities.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-black)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb)](https://mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment-blue?logo=razorpay)](https://razorpay.com/)

## 🌟 Project Overview

EVO-TYM is a comprehensive watch e-commerce platform that provides a seamless shopping experience for users and powerful management tools for administrators.

## ✨ Key Features

### User Features
- 👤 User Authentication
- 🛍️ Product Browsing
- 🛒 Shopping Cart
- 💳 Secure Payments via Razorpay
- 📦 Order Tracking
- 🔍 Product Search & Filtering

### Admin Features
- 📊 Dashboard Management
- 📝 Product Addition/Editing
- 👥 User Management
- 💹 Sales Reports
- 🏷️ Discount Management

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- EJS Templating
- Multer (File Upload)

### Payment
- Razorpay Integration

### Development Tools
- Nodemon (Development Server)
- npm (Package Management)

## 🚀 Setup & Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AjmalDevala/EVO-TYM.git
   cd EVO-TYM
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. **Run the Application**
   ```bash
   npm start
   ```

5. **Access the Website**
   Open `http://localhost:3000` in your browser

## 📂 Project Structure
```
EVO-TYM/
├── config/
├── controllers/
├── models/
├── public/
├── routes/
├── uploads/
├── views/
│   ├── admin/
│   └── user/
├── .env
├── app.js
└── package.json
```

## 🔐 Authentication Flows
- User Registration
- User Login
- Admin Login
- Password Reset

## 💳 Payment Integration
- Razorpay secure checkout
- Multiple payment methods
- Transaction logging

## 🌐 Deployment

### Recommended Platforms
- Heroku
- DigitalOcean
- Render
- Railway

### Deployment Steps
1. Set environment variables
2. Configure MongoDB Atlas
3. Set up Razorpay production keys

## 🔜 Future Roadmap
- [ ] Implement user reviews
- [ ] Add wishlist feature
- [ ] Develop mobile app
- [ ] Integrate advanced analytics
- [ ] Implement AI recommendations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## 📞 Contact

- **Email**: ajmaldevala@gmail.com
- **GitHub**: [AjmalDevala](https://github.com/AjmalDevala/)
- **LinkedIn**: [Ajmal Devala](https://www.linkedin.com/in/ajmal-devala/)

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by Ajmal Devala
