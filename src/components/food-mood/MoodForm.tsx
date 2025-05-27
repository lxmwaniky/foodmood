'use client';

import type * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';

interface MoodFormProps {
  onFormSubmit: (moodDescription: string) => Promise<void>;
  isLoading: boolean;
}

export function MoodForm({ onFormSubmit, isLoading }: MoodFormProps) {
  const [moodDescription, setMoodDescription] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!moodDescription.trim() || isLoading) return;
    await onFormSubmit(moodDescription);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 rounded-lg border bg-card p-6 shadow-lg">
      <div>
        <Label htmlFor="moodDescription" className="mb-2 block text-lg font-medium text-card-foreground">
          How are you feeling right now?
        </Label>
        <Textarea
          id="moodDescription"
          value={moodDescription}
          onChange={(e) => setMoodDescription(e.target.value)}
          placeholder="e.g., stressed out from work, happy and energetic, a bit bored..."
          rows={4}
          className="focus:ring-accent focus:border-accent"
          disabled={isLoading}
        />
        <p className="mt-1 text-sm text-muted-foreground">
          Describe your mood, and we'll suggest a snack for you!
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || !moodDescription.trim()}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Find My Snack
      </Button>
    </form>
  );
}
