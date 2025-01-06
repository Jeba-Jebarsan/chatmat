import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Add introduction if asked about identity or capabilities
    const identityQuestions = [
      "who are you",
      "what are you", 
      "what's your name",
      "who is this",
      "introduce yourself",
      "what can you do",
      "help me",
      "what are your capabilities",
      "who created you",
      "who made you"
    ];

    if (identityQuestions.some(q => message.toLowerCase().includes(q))) {
      return NextResponse.json({ 
        message: `I am ChatMate, an AI-powered assistant designed primarily for **full-stack web development**. I can help you with:

- Developing web applications using modern frameworks
- Debugging and optimizing code
- Setting up and managing databases
- Building and integrating APIs
- Solving issues with front-end and back-end development
- Providing best practices for scalable, maintainable code
- Guiding deployment and hosting strategies

I was created by **Vibushana Sharma**, and I aim to make web development tasks easier and more efficient. How can I assist you today?`
      });
    }
    
    // Enhanced prompt with context and guidelines for web development
    const enhancedPrompt = `As ChatMate (created by **Vibushana Sharma**), please provide a detailed and accurate response to the following query, with a focus on full-stack web development: ${message}

Guidelines:
- Provide clear, actionable steps or solutions
- Include code snippets formatted with proper syntax
- Explain concepts relevant to full-stack development (e.g., frameworks, databases, APIs)
- Break down complex topics for better understanding
- Share best practices and potential pitfalls in development
- Cite relevant documentation or resources when necessary`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ message: text });
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
