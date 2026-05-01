import express from "express";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";

const app = express();
const upload = multer({ dest: "uploads/" });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/analyze", upload.single("image"), async (req, res) => {

  const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: "Riassumi questa immagine in modo semplice." },
          {
            type: "input_image",
            image_base64: imageBase64
          }
        ]
      }
    ]
  });

  res.json({ summary: response.output_text });
});

app.listen(3000, () => console.log("Server avviato"));
