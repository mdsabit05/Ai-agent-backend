import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { auth } from "./config/auth.js";
import { betterAuth, includes } from "better-auth";
import { toNodeHandler } from "better-auth/node";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { Chat } from "./models/Chat.js";
import { connectDB } from "./config/db.js";

dotenv.config();  // .env connected
connectDB()    // mongoDB connected

const app = express();  // express server created

app.use(express.json());  // json body read karne ke liye middleware
// app.use(
//   cors({
//     origin: " https://ai-agent-backend-1-d43j.onrender.com",   // allowing frontend
//     // origin: "http://localhost:3000",   // allowing frontend
//     credentials: true,
//   }),
// );
// app.use(cors({
//   origin: [
//   "http://localhost:3000",
//   "https://ai-agent-frontend-up4l.vercel.app",
//   "https://ai-agent-frontend-up4l-git-main-mdsabit05s-projects.vercel.app"],
//   credentials: true
  // [
  //   "http://localhost:3000",
  //   "https://ai-agent-frontend-up4l.vercel.app",
  // "https://ai-agent-frontend-up4l-git-main-mdsabit05s-projects.vercel.app"
  // ],
// }));

app.use(cors({
  origin: true,
  credentials: "include"
}));

app.use("/api/auth", toNodeHandler(auth));   // betterAuth aona route creat kara (signup , login , session)

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });  // user logged in  hai ay nhi ye check ho rha hai

  if (!session) {
    return res.status(401).json({ message: "Not logged in" });
  }  // agar nhi hai to not logged in message dega

  res.json({ user: session.user });  // ye resposnse karega
});

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.post("/api/chat", async (req, res) => {  
  const { message } = req.body;  // user message ko message mai check kare

  const session = await auth.api.getSession({
    headers : req.headers
  });   // login check

  if (!session ) {
     return res.status(401).json({ message: "Not logged in" }); 
  }  // agar login nhi hai reject
  try {
    const result = await generateText({
      model: openrouter("gpt-4o-mini"),
      prompt: message,
    });  // open router ko msg bhej rhe hai and ai reply de rha hai
       await Chat.create({
      userId: session.user.id,
      message,
      reply: result.text
    });  // msg and rply DB mai save kar rhe hai
    res.json({reply : result.text}) // frontend ko ai ka answer mil rha hai
  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
});

app.use("/api/history" , async (req, res) => {
 try {
   const session = await auth.api.getSession({
    headers: req.headers
  });  // login check

  if (!session) {
    return res.status(401).json({ message: "Not logged in" });
  }  

  const chats = await Chat.find({
    userId: session.user.id
  }).sort({ createdAt: -1 });
  res.json({ chats }); // user ka purana data collect kar rha hai ai
 } catch(err) {
  res.status(500).json({ error: "AI failed" });
 } // kuch problem hone se error msg
});

app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
