import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Security & Content Security Policy (CSP) Verification', () => {
  it('verifies next.config.mjs enforces a strict Content Security Policy (CSP)', async () => {
    const configPath = path.resolve(__dirname, '../next.config.mjs');
    expect(fs.existsSync(configPath)).toBe(true);

    const configContent = fs.readFileSync(configPath, 'utf8');

    // Check mandatory CSP directives
    expect(configContent).toContain("default-src 'self'");
    expect(configContent).toContain("frame-ancestors 'none'");
    expect(configContent).toContain('https://air-quality-api.open-meteo.com');
    expect(configContent).toContain('https://generativelanguage.googleapis.com');
    expect(configContent).toContain("base-uri 'self'");

    // Check vital HTTP security headers
    expect(configContent).toContain('X-Frame-Options');
    expect(configContent).toContain('DENY');
    expect(configContent).toContain('X-Content-Type-Options');
    expect(configContent).toContain('nosniff');
    expect(configContent).toContain('Strict-Transport-Security');
    expect(configContent).toContain('Referrer-Policy');
    expect(configContent).toContain('strict-origin-when-cross-origin');
    expect(configContent).toContain('poweredByHeader: false');
  });

  it('scans all codebase modules to verify ZERO hard-coded API secrets or keys', () => {
    const searchDirs = ['lib', 'components', 'app', 'examples'];
    const suspiciousPatterns = [
      /AIzaSy[A-Za-z0-9_-]{33}/,                // Google API Key pattern
      /sk-[A-Za-z0-9]{20,}/,                   // OpenAI / Generic Secret Key
      /ghp_[A-Za-z0-9]{36}/,                   // GitHub Token
      /xox[baprs]-[A-Za-z0-9-]{10,}/,          // Slack Token
      /(?:password|secret|apikey)\s*=\s*['"][a-zA-Z0-9_\-]{16,}['"]/i, // Generic hardcoded secrets
    ];

    function scanDirectory(dirPath: string) {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (/\.(ts|tsx|js|mjs|json)$/.test(entry.name)) {
          const fileContent = fs.readFileSync(fullPath, 'utf8');

          for (const pattern of suspiciousPatterns) {
            const match = pattern.exec(fileContent);
            if (match) {
              throw new Error(
                `SECURITY VIOLATION: Potential hardcoded secret detected in ${fullPath}: "${match[0].slice(0, 8)}..."`
              );
            }
          }
        }
      }
    }

    for (const dir of searchDirs) {
      const fullDir = path.resolve(__dirname, '..', dir);
      if (fs.existsSync(fullDir)) {
        scanDirectory(fullDir);
      }
    }
  });

  it('verifies all API keys are retrieved strictly through process.env', () => {
    const geminiAdvisorPath = path.resolve(__dirname, '../lib/gemini-advisor.ts');
    const content = fs.readFileSync(geminiAdvisorPath, 'utf8');

    // Key retrieval must use process.env
    expect(content).toContain('process.env.GEMINI_API_KEY');
    expect(content).toContain('process.env.VERTEX_AI_API_KEY');
    expect(content).toContain('process.env.GOOGLE_API_KEY');
  });
});
