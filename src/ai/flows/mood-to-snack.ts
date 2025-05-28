'use server';
/**
 * @fileOverview Mood to Snack Suggestion AI agent.
 *
 * - moodToSnack - A function that handles the mood to snack suggestion process.
 * - MoodToSnackInput - The input type for the moodToSnack function.
 * - MoodToSnackOutput - The return type for the moodToSnack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoodToSnackInputSchema = z.object({
  mood: z.string().describe('The current mood of the user.'),
  availableSnacks: z
    .string()
    .describe('A comma-separated list of snacks the user has available.'),
});
export type MoodToSnackInput = z.infer<typeof MoodToSnackInputSchema>;

const MoodToSnackOutputSchema = z.object({
  suggestedSnack: z.string().describe('A snack suggestion based on the user\'s mood.'),
  reason: z
    .string()
    .describe('The reason why the snack is suggested for the given mood.'),
});
export type MoodToSnackOutput = z.infer<typeof MoodToSnackOutputSchema>;

export async function moodToSnack(input: MoodToSnackInput): Promise<MoodToSnackOutput> {
  return moodToSnackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moodToSnackPrompt',
  input: {schema: MoodToSnackInputSchema},
  output: {schema: MoodToSnackOutputSchema},
  prompt: `You are a snack suggestion expert. Given a user's mood and a list of available snacks, you will suggest a snack or street food that matches their emotional state.

Mood: {{{mood}}}
Available Snacks: {{{availableSnacks}}}

Consider the available snacks when making your suggestion. Explain why you are suggesting the snack for the given mood.`,
});

const moodToSnackFlow = ai.defineFlow(
  {
    name: 'moodToSnackFlow',
    inputSchema: MoodToSnackInputSchema,
    outputSchema: MoodToSnackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
