import { getRepositories } from './instance';
import type { Repositories } from './types';

/**
 * useRepositories
 */

export const useRepositories = (): Repositories => getRepositories();
