import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./database";

dotenv.config();

const app: Express = express();
const port = process.env.API_PORT || 8000;

app.get("/", async (req: Request, res: Response) => {
  let dbConnected = false;
  try {
    const [results]: any[] = await sequelize.query("SELECT 1 + 1;");
    dbConnected = results.length && results[0]["?column?"] === 2;
  } catch (error) {
    console.error("Database query error:", error);
  }

  res.json({
    date: new Date().toISOString(),
    status: "up",
    dbConnected,
    url: `${req.protocol}://${req.hostname}`,
  });
});

app.listen(port, async () => {
  console.log(`🚀Server started successfully on port ${port}`);
  await connectDB();
  sequelize.sync({ force: false }).then(() => {
    console.log("✅ Synced database successfully...");
  }).catch((error) => {
    console.error("❌ Error syncing database:", error);
  });
});
