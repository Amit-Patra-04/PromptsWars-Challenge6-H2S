'use client';

import React, { useState, useEffect } from 'react';
import { Wind, Globe, CaretDown, ShieldCheck, List, X } from '@phosphor-icons/react';
import { SUPPORTED_LANGUAGES, SupportedLanguage, getTranslation } from '@/lib/i18n';

/**
 * ACCESSIBILITY FEATURES:
 * - Semantic <header>, <nav aria-label="Primary Navigation">, and skip to content link.
 * - Mobile responsive menu toggle with aria-expanded and keyboard Esc listener.
 * - Language switcher dropdown with role="menu", role="menuitem", and aria-haspopup.
 * - 2px high contrast focus rings for keyboard users.
 */

interface NavbarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onLaunchAdvisor: () => void;
}

export default function Navbar({ currentLang, onLanguageChange, onLaunchAdvisor }: NavbarProps) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setLangMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { href: '#advisor', label: 'Air Advisor' },
    { href: '#indoor-advice', label: 'Indoor Hacks' },
    { href: '#greener-swaps', label: 'Greener Swaps' },
    { href: '#calculator', label: 'CADR Tool' },
    { href: '#benefits', label: 'Protections' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <>
      {/* Keyboard Accessibility Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-100 focus:left-100 focus:z-50 focus:bg-white focus:text-black focus:py-75 focus:px-100 focus:rounded-md focus:font-semibold focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Floating Compact Navigation Bar */}
      <header className="fixed top-75 md:top-100 inset-x-0 z-40 flex justify-center px-75 md:px-100 pointer-events-none">
        <nav
          aria-label="Primary Navigation"
          className="pointer-events-auto flex items-center justify-between gap-100 md:gap-250 w-full max-w-5xl bg-surface-1/90 backdrop-blur-md border border-border-default rounded-full px-150 md:px-200 py-50 md:py-75 transition-all duration-500 ease-base shadow-2xl"
        >
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full p-25"
            aria-label="AeroPulse Home"
          >
            <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center border border-border-subtle shrink-0">
              <Wind size={18} weight="bold" className="text-white" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="title-3 text-white tracking-tight leading-none font-semibold">AeroPulse</span>
              <span className="caption-5 text-neutral-400 leading-none mt-25 hidden sm:block">Urban Smog Advisor</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-150" role="menubar">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                role="menuitem"
                className="caption-1 text-neutral-300 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-50 py-25"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Controls: Language, Launch Button, Mobile Toggle */}
          <div className="flex items-center gap-75">
            {/* Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-haspopup="true"
                aria-expanded={langMenuOpen}
                aria-label={`Select language, currently ${currentLang.toUpperCase()}`}
                className="flex items-center gap-50 bg-surface-2 hover:bg-surface-3 text-neutral-200 hover:text-white py-50 px-75 md:py-75 md:px-100 rounded-full border border-border-subtle button-xsm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Globe size={14} weight="bold" aria-hidden="true" />
                <span>{SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.flag || 'EN'}</span>
                <CaretDown
                  size={12}
                  weight="bold"
                  aria-hidden="true"
                  className={`transition-transform duration-300 ${langMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {langMenuOpen && (
                <div
                  role="menu"
                  aria-label="Language options"
                  className="absolute right-0 mt-50 w-40 bg-surface-2 border border-border-default rounded-xl shadow-2xl py-50 z-50 overflow-hidden"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      role="menuitem"
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-100 py-75 text-left caption-2 transition-colors duration-200 focus:outline-none focus-visible:bg-surface-3 ${
                        currentLang === lang.code
                          ? 'bg-surface-3 text-white font-semibold'
                          : 'text-neutral-300 hover:bg-surface-3 hover:text-white'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="caption-5 text-neutral-400 font-mono">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Launch Advisor CTA */}
            <button
              type="button"
              onClick={onLaunchAdvisor}
              className="hidden sm:inline-flex items-center gap-50 bg-white hover:bg-neutral-200 text-black py-50 px-75 md:py-75 md:px-100 rounded-full button-sm transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ShieldCheck size={16} weight="bold" aria-hidden="true" />
              <span>{getTranslation(currentLang, 'primaryCta')}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden p-50 rounded-full bg-surface-2 hover:bg-surface-3 text-neutral-200 hover:text-white border border-border-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {mobileMenuOpen ? (
                <X size={20} weight="bold" aria-hidden="true" />
              ) : (
                <List size={20} weight="bold" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Slide-down Panel */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="pointer-events-auto fixed inset-x-75 top-600 bg-surface-1/95 backdrop-blur-xl border border-border-default rounded-2xl p-200 shadow-2xl flex flex-col gap-100 animate-fadeIn z-50 lg:hidden"
          >
            <div className="flex items-center justify-between pb-75 border-b border-border-subtle">
              <span className="caption-3 text-neutral-400 font-mono">NAVIGATION</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-25 text-neutral-400 hover:text-white"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="flex flex-col gap-50">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-75 px-100 rounded-lg text-neutral-200 hover:text-white hover:bg-surface-2 caption-1 font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-100 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLaunchAdvisor();
                }}
                className="w-full flex items-center justify-center gap-50 bg-white text-black py-75 px-100 rounded-lg button-sm font-semibold"
              >
                <ShieldCheck size={16} weight="bold" aria-hidden="true" />
                <span>{getTranslation(currentLang, 'primaryCta')}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
