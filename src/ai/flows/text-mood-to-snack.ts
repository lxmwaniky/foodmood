"use server";

/**
 * @fileOverview Suggests a snack based on the user's mood described in text, specializing in n options.
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
    .describe("A suggested n snack or street food based on the mood."),
  reason: z
    .string()
    .describe("The reason why the n snack is suggested for the mood."),
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
  prompt: `You are a snack and street food expert who understands how different foods can affect moods and emotions. Your expertise lies in recommending delicious snacks that perfectly match people's emotional states.

Considering this mood description: {{{moodDescription}}}

Please analyze the mood and suggest ONE perfect snack or street food that would enhance or complement their emotional state. Consider factors like:
- The comfort level the food provides
- The universal appeal of the snack
- The textures and flavors that match the emotional state
- Whether the mood calls for something energizing or soothing

Provide:
1. A clear analysis of their mood
2. A specific snack or street food recommendation
3. A thoughtful explanation connecting the mood to the recommended snack's characteristics
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
