import type { Repositories } from './types';

let instance: Repositories | null = null;

export const setRepositories = (repos: Repositories): void => {
  instance = repos;
};

export const getRepositories = (): Repositories => {
  if (!instance) {
    throw new Error(
      'Repositories not initialized. Call setRepositories() first.'
    );
  }
  return instance;
};
