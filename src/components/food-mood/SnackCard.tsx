
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Smile, Info } from 'lucide-react';
import type { TextMoodToSnackOutput } from '@/ai/flows/text-mood-to-snack';
import { useToast } from '@/hooks/use-toast';

interface SnackCardProps {
  snack: TextMoodToSnackOutput;
}

export function SnackCard({ snack }: SnackCardProps) {
  const { toast } = useToast();

  const handleFeedback = (feedback: 'liked' | 'disliked') => {
    // In a real app, this would store preferences.
    console.log(`User ${feedback} ${snack.snackSuggestion}`);
    toast({
      title: "Feedback Received!",
      description: `You ${feedback} ${snack.snackSuggestion}. We'll remember that (not really, this is a demo).`,
    });
  };

  return (
    <Card className="w-full overflow-hidden shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
      <CardContent className="p-6">
        <CardTitle className="mb-2 text-3xl font-semibold text-primary">
          {snack.snackSuggestion || 'Tasty Snack'}
        </CardTitle>
        
        {snack.mood && (
          <div className="mb-3 flex items-center text-sm text-muted-foreground">
            <Smile className="mr-2 h-4 w-4 text-accent" />
            <span>Perfect for when you're feeling: <strong>{snack.mood}</strong></span>
          </div>
        )}

        {snack.reason && (
          <CardDescription className="text-base leading-relaxed">
            <Info className="mr-2 inline h-4 w-4 text-accent" />
            <strong>Why this snack?</strong> {snack.reason}
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-3 bg-muted/50 p-4">
        <Button variant="outline" size="sm" onClick={() => handleFeedback('disliked')}>
          <ThumbsDown className="mr-2 h-4 w-4" />
          Not for me
        </Button>
        <Button variant="default" size="sm" onClick={() => handleFeedback('liked')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <ThumbsUp className="mr-2 h-4 w-4" />
          Sounds Good!
        </Button>
      </CardFooter>
    </Card>
  );
}
