// This file replaces all Convex API calls with localStorage implementations

export const api = {
  // Empty object that will be used as a replacement for Convex imports
}

// This helps components that expect a Convex API but we're using localStorage instead
export function createMockApi() {
  return api
}
