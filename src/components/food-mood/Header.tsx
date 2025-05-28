import { Cookie } from 'lucide-react';

export function Header() {
  return (
    <header className="py-8 text-center">
      <div className="flex items-center justify-center space-x-3">
        <Cookie className="h-12 w-12 text-primary" />
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Food Mood
        </h1>
      </div>
      <p className="mt-2 text-lg text-muted-foreground">
        Discover the perfect snack/street meal for how you feel.
      </p>
    </header>
  );
}
