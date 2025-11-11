import OpenAI from "openai";

const client = new OpenaAI({
  apiKey: process.env.API_KEY_OPENAI,
});

const response = await client.chat.completions.create({
    model: 
})
