import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for prefers-reduced-motion queries in tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock requestAnimationFrame & cancelAnimationFrame
window.requestAnimationFrame = vi.fn((cb) => Number(setTimeout(cb, 0))) as any;
window.cancelAnimationFrame = vi.fn((id) => clearTimeout(id as any)) as any;
