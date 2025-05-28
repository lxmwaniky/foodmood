"use server";

/**
 * @fileOverview Suggests a snack based on the user's mood described in text, specializing in Kenyan options.
 *
 * - textMoodToSnack - A function that suggests snacks based on the user's mood described in text.
 * - TextMoodToSnackInput - The input type for the textMoodToSnack function.
 * - TextMoodToSnackOutput - The return type for the textMoodToSnack function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const TextMoodToSnackInputSchema = z.object({
  moodDescription: z
    .string()
    .describe("A description of the user's current mood in free-form text."),
});
export type TextMoodToSnackInput = z.infer<typeof TextMoodToSnackInputSchema>;

const TextMoodToSnackOutputSchema = z.object({
  mood: z.string().describe("The analyzed mood of the user."),
  snackSuggestion: z
    .string()
    .describe("A suggested Kenyan snack or street food based on the mood."),
  reason: z
    .string()
    .describe("The reason why the Kenyan snack is suggested for the mood."),
});
export type TextMoodToSnackOutput = z.infer<typeof TextMoodToSnackOutputSchema>;

export async function textMoodToSnack(
  input: TextMoodToSnackInput
): Promise<TextMoodToSnackOutput> {
  return textMoodToSnackFlow(input);
}

const prompt = ai.definePrompt({
  name: "textMoodToSnackPrompt",
  input: { schema: TextMoodToSnackInputSchema },
  output: { schema: TextMoodToSnackOutputSchema },
  prompt: `
You are a culinary expert and mood-based snack recommender with deep knowledge of Kenyan snacks and street foods. Your goal is to interpret a person's emotional state and suggest one Kenyan snack or street food that best fits their mood. You should respond with empathy, cultural awareness, and creativity.

Analyze the emotional tone of the user’s mood description and match it with a snack that complements or balances that feeling. Consider taste, texture, comfort factor, cultural meaning, or energy boost as factors in your recommendation.

Here are examples of popular Kenyan snacks and street foods to consider: mutura, smokies, mayai pasua, mahamri, kaimati, viazi karai, samosas, chapati, mandazi, mkate mayai, bhajias, kachumbari, boiled maize, roasted cassava, etc.

Respond with:
- The **interpreted mood** (summarized)
- A **snack suggestion**
- A **reason** linking the snack to the mood, considering comfort, energy, flavor, or emotional relief.

Mood description: {{{moodDescription}}}

Be warm, thoughtful, and insightful in your response.
`,
});

const textMoodToSnackFlow = ai.defineFlow(
  {
    name: "textMoodToSnackFlow",
    inputSchema: TextMoodToSnackInputSchema,
    outputSchema: TextMoodToSnackOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
