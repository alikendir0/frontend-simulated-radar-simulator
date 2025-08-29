import express from "express";
import aircraftRoutes from "./routes/AircraftRoutes";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use("/images/icons", express.static(path.join(__dirname, "images/icons")));
console.log("Serving static files from:", path.join(__dirname, "images/icons"));

app.use("/api/aircraft", aircraftRoutes);

export default app;
