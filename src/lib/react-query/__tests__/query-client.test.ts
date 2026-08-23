import { createQueryClient, createTestQueryClient } from '../query-client';

/**
 * Tests
 */

describe('createQueryClient', () => {
  it('should return a client with staleTime 30s, retry 1, refetchOnWindowFocus false', () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions();
    expect(defaults.queries?.staleTime).toBe(30_000);
    expect(defaults.queries?.retry).toBe(1);
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
  });
});

describe('createTestQueryClient', () => {
  it('should return a client with retry 0', () => {
    const client = createTestQueryClient();
    const defaults = client.getDefaultOptions();
    expect(defaults.queries?.retry).toBe(0);
  });
});
