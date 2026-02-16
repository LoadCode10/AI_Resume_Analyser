require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');


const genAI = new GoogleGenAI(
  {apiKey: process.env.GEMINI_API_KEY}
);

async function geminiService(prompt){
  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  return response.text;
};

module.exports = { geminiService };









// const { GoogleGenerativeAI } = require('@google/generative-ai');y

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({
//   model: "gemini-flash-latest"
// });

// module.exports = model;

