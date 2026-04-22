import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { mailTransporter } from "./config/mail.js";

const APP_PORT = process.env.APP_PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    console.log("Database connected");

    await mailTransporter.verify();
    console.log("SMTP connection verified");

    app.listen(APP_PORT, () => {
      console.log(`Server running on port ${APP_PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
