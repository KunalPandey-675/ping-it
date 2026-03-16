import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function POST() {
  try {
    const result = await generateObject({
      model: google("gemini-2.5-flash"),

      schema: z.object({
        questions: z.array(z.string()).length(3)
      }),

      prompt: `
Generate three open-ended and engaging questions for an anonymous social messaging platform similar to Qooh.me.

Rules:
- Suitable for a diverse audience
- Avoid personal or sensitive topics
- Encourage friendly interaction
- Each item must be a question
- Return exactly 3 items
`
    });

    return Response.json({
      success: true,
      questions: result.object.questions
    });

  } catch (error) {
    console.error("Error generating AI response:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate AI response"
      },
      { status: 500 }
    );
  }
}