import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  sessionSecret: process.env.SESSION_SECRET,
  gmail_user: process.env.GMAIL_USER,
  gmail_password: process.env.GMAIL_PASSWORD,
  environment: process.env.NODE_ENV,
};

