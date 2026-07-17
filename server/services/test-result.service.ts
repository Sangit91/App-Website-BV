import { testResults, TestResult } from "../db/database";

export const testResultService = {
  findByCode(code: string): TestResult | null {
    return testResults[code.trim().toUpperCase()] || null;
  },

  getAllCodes(): string[] {
    return Object.keys(testResults);
  }
};