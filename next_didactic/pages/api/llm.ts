import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { model, prompt } = req.body;

  if (!model || !prompt) {
    return res.status(400).json({ error: 'Missing model or prompt' });
  }

  try {
    let result;

    switch (model) {
      case 'claude':
        result = await claudeCompletion(prompt);
        break;
      case 'gpt':
        result = await gptCompletion(prompt);
        break;
      case 'gemini':
        result = await geminiCompletion(prompt);
        break;
      default:
        return res.status(400).json({ error: 'Invalid model specified' });
    }

    res.status(200).json({ result });
  } catch (error) {
    console.error('Error processing LLM request:', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
}

async function claudeCompletion(prompt: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });
  return response.content[0].text;
}

async function gptCompletion(prompt: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0].message.content;
}

async function geminiCompletion(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}