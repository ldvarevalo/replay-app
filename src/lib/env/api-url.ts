import Constants from 'expo-constants';

/**
 * Constants
 */

const url = Constants.expoConfig?.extra?.apiUrl as string | undefined;

if (!url) {
  throw new Error('apiUrl is not defined in app config extra');
}

/**
 * apiUrl
 */

export const apiUrl: string = url;
