import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import profileRoute from "./routes/profile.route.js";
import itineraryRoute from "./routes/itinerary.route.js";

const app = express();

app.use(
	cors({
		origin: process.env.APP_CLIENT_URL?.split(",") ?? true,
		credentials: true,
	}),
);
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/itinerary", itineraryRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
