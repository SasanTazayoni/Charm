export async function fetchWithRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delayMs = 1000,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastErr = err;
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * 2 ** attempt));
      }
    }
  }
  throw lastErr;
}
