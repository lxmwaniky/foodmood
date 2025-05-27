
'use server';

import { textMoodToSnack, type TextMoodToSnackOutput } from '@/ai/flows/text-mood-to-snack';

export async function getSnackForMoodAction(moodDescription: string): Promise<{ data?: TextMoodToSnackOutput; error?: string }> {
  if (!moodDescription || moodDescription.trim().length < 3) {
    return { error: "Mood description must be at least 3 characters long. Please tell us a bit more!" };
  }
  if (moodDescription.trim().length > 500) {
    return { error: "Mood description is too long (max 500 characters). Please be more concise." };
  }

  try {
    const result = await textMoodToSnack({ moodDescription });
    
    if (!result || !result.snackSuggestion || !result.mood || !result.reason) {
        console.warn("AI result incomplete:", result);
        return { error: "Sorry, we couldn't quite understand that mood or find a snack. Could you try describing your feeling differently?" };
    }
    return { data: result };
  } catch (e) {
    console.error("Error in getSnackForMoodAction calling textMoodToSnack:", e);
    const rawErrorMessage = e instanceof Error ? e.message : "An underlying AI service call failed.";
    
    return { error: `Failed to get snack suggestion due to an issue with the AI service. This could be related to your API key or Google Cloud project configuration. Please verify them. (Details: ${rawErrorMessage.substring(0, 150)})` };
  }
}
