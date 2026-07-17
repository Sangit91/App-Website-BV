const requiredVars = ['GEMINI_API_KEY'] as const;
const optionalVars = ['VITE_APP_NAME', 'VITE_HOSPITAL_ADDRESS', 'VITE_HOTLINE', 'VITE_API_URL'] as const;

export interface EnvConfig {
  GEMINI_API_KEY: string;
  VITE_APP_NAME?: string;
  VITE_HOSPITAL_ADDRESS?: string;
  VITE_HOTLINE?: string;
  VITE_API_URL?: string;
}

function validateEnv(): EnvConfig {
  const config: Partial<EnvConfig> = {};
  const missing: string[] = [];

  for (const key of requiredVars) {
    const value = import.meta.env[key];
    if (value && value !== "") {
      (config as any)[key] = value;
    } else {
      missing.push(key);
    }
  }

  for (const key of optionalVars) {
    const value = import.meta.env[key];
    if (value && value !== "") {
      (config as any)[key] = value;
    }
  }

  if (missing.length > 0) {
    console.warn(
      `⚠️ Missing recommended environment variables:\n` +
      missing.map(k => `  - ${k}`).join('\n') +
      `\n\nSome features may not work without these. Copy .env.example to .env and fill in the values.`
    );
  }

  return config as EnvConfig;
}

export const env = validateEnv();
export default env;