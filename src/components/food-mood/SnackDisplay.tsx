'use client';

import type { TextMoodToSnackOutput } from '@/ai/flows/text-mood-to-snack';
import { SnackCard } from './SnackCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Lightbulb } from 'lucide-react';

interface SnackDisplayProps {
  suggestion: TextMoodToSnackOutput | null;
  isLoading: boolean;
  error: string | null;
}

export function SnackDisplay({ suggestion, isLoading, error }: SnackDisplayProps) {
  if (isLoading) {
    return (
      <div className="w-full space-y-4 rounded-lg border bg-card p-6 shadow-lg">
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-10 w-full" />
        <div className="flex justify-end space-x-2 pt-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Oops! Something went wrong.</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (suggestion) {
    return <SnackCard snack={suggestion} />;
  }

  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center shadow-sm">
      <Lightbulb className="mb-4 h-16 w-16 text-muted-foreground opacity-50" />
      <h3 className="text-xl font-semibold text-card-foreground">Your Snack Awaits!</h3>
      <p className="text-muted-foreground">
        Tell us how you're feeling, and we'll find the perfect treat for you.
      </p>
    </div>
  );
}
