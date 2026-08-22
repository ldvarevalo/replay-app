import Constants from 'expo-constants';

/**
 * getApiUrl
 */

export const getApiUrl = (): string => {
  const url = Constants.expoConfig?.extra?.apiUrl as string | undefined;
  if (!url) {
    throw new Error('apiUrl is not defined in app config extra');
  }
  return url;
};
