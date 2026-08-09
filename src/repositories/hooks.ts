import { getRepositories } from './instance';
import type { Repositories } from './types';

export const useRepositories = (): Repositories => getRepositories();
