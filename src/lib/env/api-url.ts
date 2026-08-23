import Constants from 'expo-constants';

/**
 * apiUrl
 */

const url = Constants.expoConfig?.extra?.apiUrl as string | undefined;

if (!url) {
  throw new Error('apiUrl is not defined in app config extra');
}

export const apiUrl: string = url;
