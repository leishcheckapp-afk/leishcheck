import { Moon, Sun } from 'lucide-react';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';

export function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useLeishCheckStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border/50 shadow-lg transition-all hover:scale-110 active:scale-95"
      style={{
        background: 'hsl(var(--card) / 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      aria-label={darkMode ? 'Light mode' : 'Dark mode'}
    >
      {darkMode ? (
        <Sun className="h-5 w-5 text-warning" />
      ) : (
        <Moon className="h-5 w-5 text-muted-foreground" />
      )}
    </button>
  );
}
