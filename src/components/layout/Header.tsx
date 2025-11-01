'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // メニューリンクの共通スタイル
  const navLinkClass = "text-sm font-medium text-pastel-900 hover:text-primary transition-colors dark:text-pastel-200 dark:hover:text-primary-light";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-pastel-300/50 bg-gradient-to-r from-pastel-50 to-pastel-100/80 backdrop-blur-sm shadow-sm dark:border-pastel-500/50 dark:from-pastel-900 dark:to-pastel-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
          <span className="text-xl font-bold text-pastel-800 dark:text-pastel-100">奄美大島旅行しおり</span>
        </Link>

        {/* デスクトップメニュー */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/#tour-content" className={navLinkClass}>
            ツアー内容
          </Link>
          <Link href="/schedule" className={navLinkClass}>
            ツアー日程
          </Link>
          <Link href="/map" className={navLinkClass}>
            奄美大島歩き方
          </Link>
          <Link href="/split" className={navLinkClass}>
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
              className="hidden md:flex"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          
          {/* モバイルメニューボタン */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* モバイルメニュー */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-pastel-300/50 dark:border-pastel-500/50 bg-gradient-to-r from-pastel-50 to-pastel-100/80 backdrop-blur-sm dark:from-pastel-900 dark:to-pastel-800">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/#tour-content"
              className={`block py-2 ${navLinkClass}`}
              onClick={closeMobileMenu}
            >
              ツアー内容
            </Link>
            <Link
              href="/schedule"
              className={`block py-2 ${navLinkClass}`}
              onClick={closeMobileMenu}
            >
              ツアー日程
            </Link>
            <Link
              href="/map"
              className={`block py-2 ${navLinkClass}`}
              onClick={closeMobileMenu}
            >
              奄美大島歩き方
            </Link>
            <Link
              href="/split"
              className={`block py-2 ${navLinkClass}`}
              onClick={closeMobileMenu}
            >
              割り勘・立替
            </Link>
            {mounted && (
              <div className="pt-2 border-t border-pastel-300/50 dark:border-pastel-500/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toggleTheme();
                    closeMobileMenu();
                  }}
                  aria-label="Toggle theme"
                  className="w-full justify-start"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      ライトモード
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      ダークモード
                    </>
                  )}
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

