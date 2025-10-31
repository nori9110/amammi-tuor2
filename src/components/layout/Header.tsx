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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">奄美大島旅行しおり</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/#tour-content" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300">
            ツアー内容
          </Link>
          <Link href="/schedule" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300">
            ツアー日程
          </Link>
          <Link href="/map" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300">
            GoogleMap
          </Link>
          <Link href="/split" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300">
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

