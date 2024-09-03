import { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, background, depth, preparation, resources } = req.body;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `Generate a lesson plan on the topic: "${topic}".
          User background: ${background}
          Desired depth: ${depth}
          Preparation goal: ${preparation}
          Initial resources: ${resources}
          
          Please provide the lesson plan in the format of a bulleted list with subfields. 
          You are free to generate a plan creatively. Please tailor it to the user, depth, goal, and resources (if any provided).
          `
        }
      ],
    });

    const lessonPlan = response.content[0].text;

    res.status(200).json({ lessonPlan });
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    res.status(500).json({ error: 'Error generating lesson plan' });
  }
}