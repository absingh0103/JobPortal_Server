import app from "./app.js";
import cloudinary from "cloudinary";
import { config } from "dotenv";
import  express  from "express";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});
app.get("/serverrunning",async(req,resp)=>{
  resp.status(200).json("Server Running Cron Job");
})

app.use(express.static(path.join(__dirname, "./client/dist")));
app.get("*", function (_, resp) {
  resp.sendFile(path.join(__dirname, "./client/dist/index.html"), function (err) {
    resp.status(500).send(err);
  })
})

app.listen(process.env.PORT || 8080,() => {
  console.log(`Server running at port ${process.env.PORT}`);
});
