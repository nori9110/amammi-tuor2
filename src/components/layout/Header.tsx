'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-pastel-300/50 bg-gradient-to-r from-pastel-50 to-pastel-100/80 backdrop-blur-sm shadow-sm dark:border-pastel-500/50 dark:from-pastel-900 dark:to-pastel-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-pastel-800 dark:text-pastel-100">奄美大島旅行しおり</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/#tour-content" className="text-sm font-medium text-pastel-900 hover:text-primary transition-colors dark:text-pastel-200 dark:hover:text-primary-light">
            ツアー内容
          </Link>
          <Link href="/schedule" className="text-sm font-medium text-pastel-900 hover:text-primary transition-colors dark:text-pastel-200 dark:hover:text-primary-light">
            ツアー日程
          </Link>
          <Link href="/map" className="text-sm font-medium text-pastel-900 hover:text-primary transition-colors dark:text-pastel-200 dark:hover:text-primary-light">
            奄美大島歩き方
          </Link>
          <Link href="/split" className="text-sm font-medium text-pastel-900 hover:text-primary transition-colors dark:text-pastel-200 dark:hover:text-primary-light">
            割り勘・立替
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          {mounted && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

