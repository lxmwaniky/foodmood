'use server';

/**
 * @fileOverview Suggests a snack based on the user's mood described in text.
 *
 * - textMoodToSnack - A function that suggests snacks based on the user's mood described in text.
 * - TextMoodToSnackInput - The input type for the textMoodToSnack function.
 * - TextMoodToSnackOutput - The return type for the textMoodToSnack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TextMoodToSnackInputSchema = z.object({
  moodDescription: z
    .string()
    .describe('A description of the user\'s current mood in free-form text.'),
});
export type TextMoodToSnackInput = z.infer<typeof TextMoodToSnackInputSchema>;

const TextMoodToSnackOutputSchema = z.object({
  mood: z.string().describe('The analyzed mood of the user.'),
  snackSuggestion: z.string().describe('A suggested snack based on the mood.'),
  reason: z
    .string()
    .describe('The reason why the snack is suggested for the mood.'),
});
export type TextMoodToSnackOutput = z.infer<typeof TextMoodToSnackOutputSchema>;

export async function textMoodToSnack(input: TextMoodToSnackInput): Promise<TextMoodToSnackOutput> {
  return textMoodToSnackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'textMoodToSnackPrompt',
  input: {schema: TextMoodToSnackInputSchema},
  output: {schema: TextMoodToSnackOutputSchema},
  prompt: `You are a snack recommendation expert. A user will describe their mood, and you will provide a single snack suggestion that is appropriate for their mood.

Mood description: {{{moodDescription}}}

Consider the user's mood when suggesting a snack. Explain the reason why you are suggesting this snack.

Output the mood that you analyzed, a snack suggestion, and a reason for the suggestion.
`,
});

const textMoodToSnackFlow = ai.defineFlow(
  {
    name: 'textMoodToSnackFlow',
    inputSchema: TextMoodToSnackInputSchema,
    outputSchema: TextMoodToSnackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
