
'use client';

import { useState, useEffect } from 'react';
import type { TextMoodToSnackOutput } from '@/ai/flows/text-mood-to-snack';
import { Header } from '@/components/food-mood/Header';
import { MoodForm } from '@/components/food-mood/MoodForm';
import { SnackDisplay } from '@/components/food-mood/SnackDisplay';
import { getSnackForMoodAction } from './actions';
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [snackSuggestion, setSnackSuggestion] = useState<TextMoodToSnackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (moodDescription: string) => {
    setIsLoading(true);
    setError(null);
    setSnackSuggestion(null); 

    try {
      const result = await getSnackForMoodAction(moodDescription);

      if (result.data) {
        setSnackSuggestion(result.data);
        toast({
          title: "Snack Found!",
          description: `We found a snack for your mood: ${result.data.mood}.`,
        });
      } else if (result.error) {
        setError(result.error);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        const unexpectedErrorMsg = "Received an unexpected response from the suggestion service.";
        setError(unexpectedErrorMsg);
        toast({
            title: "Unexpected Response",
            description: unexpectedErrorMsg,
            variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Error in form submission process:", e);
      const genericMessage = "An error occurred while finding your snack. Please try again.";
      setError(genericMessage);
      try {
        toast({
          title: "Submission Error",
          description: genericMessage,
          variant: "destructive",
        });
      } catch (toastErr) {
        console.error("Nested toast error during critical error handling:", toastErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="container mx-auto flex flex-1 flex-col items-center px-4 py-8 md:py-12">
        <Header />
        <div className="w-full max-w-2xl space-y-8">
          <MoodForm onFormSubmit={handleFormSubmit} isLoading={isLoading} />
          <div className="mt-8 w-full">
            <SnackDisplay suggestion={snackSuggestion} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Alex Nyambura. All snacks reserved (for eating).</p>
      </footer>
    </div>
  );
}
