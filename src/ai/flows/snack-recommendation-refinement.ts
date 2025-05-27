'use server';

/**
 * @fileOverview Refines snack recommendations based on user mood and snack availability.
 *
 * - refineSnackRecommendation - A function that refines snack recommendations.
 * - RefineSnackRecommendationInput - The input type for the refineSnackRecommendation function.
 * - RefineSnackRecommendationOutput - The return type for the refineSnackRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineSnackRecommendationInputSchema = z.object({
  mood: z.string().describe('The current mood of the user.'),
  region: z.string().describe('The region of the user.'),
  initialSnackSuggestions: z
    .string()
    .describe('A comma separated list of initial snack suggestions.'),
});
export type RefineSnackRecommendationInput = z.infer<
  typeof RefineSnackRecommendationInputSchema
>;

const RefineSnackRecommendationOutputSchema = z.object({
  refinedSnackSuggestions: z
    .string()!
    .describe(
      'A comma separated list of refined snack suggestions, considering snack availability in the user region.'
    ),
});
export type RefineSnackRecommendationOutput = z.infer<
  typeof RefineSnackRecommendationOutputSchema
>;

export async function refineSnackRecommendation(
  input: RefineSnackRecommendationInput
): Promise<RefineSnackRecommendationOutput> {
  return refineSnackRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineSnackRecommendationPrompt',
  input: {schema: RefineSnackRecommendationInputSchema},
  output: {schema: RefineSnackRecommendationOutputSchema},
  prompt: `You are a snack recommendation expert. Given the user's mood and region, refine the snack suggestions to ensure they are easily obtainable in the user's region.

Mood: {{{mood}}}
Region: {{{region}}}
Initial Snack Suggestions: {{{initialSnackSuggestions}}}

Refined Snack Suggestions:`,
});

const refineSnackRecommendationFlow = ai.defineFlow(
  {
    name: 'refineSnackRecommendationFlow',
    inputSchema: RefineSnackRecommendationInputSchema,
    outputSchema: RefineSnackRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {refinedSnackSuggestions: output!.refinedSnackSuggestions!};
  }
);
