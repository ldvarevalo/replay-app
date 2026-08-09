import * as SecureStore from 'expo-secure-store';
import { createSecureStoreStorage } from '../storage';

jest.mock('expo-secure-store');

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

/**
 * Tests
 */

describe('createSecureStoreStorage', () => {
  it('should return an object with getItem, setItem, removeItem', () => {
    const storage = createSecureStoreStorage();
    expect(typeof storage.getItem).toBe('function');
    expect(typeof storage.setItem).toBe('function');
    expect(typeof storage.removeItem).toBe('function');
  });

  it('should return the value from SecureStore on getItem', async () => {
    mockSecureStore.getItemAsync.mockResolvedValue('abc123');
    const storage = createSecureStoreStorage();
    expect(await storage.getItem('key')).toBe('abc123');
    expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('key');
  });

  it('should call SecureStore.setItemAsync on setItem', async () => {
    mockSecureStore.setItemAsync.mockResolvedValue();
    const storage = createSecureStoreStorage();
    await storage.setItem('key', 'value');
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('key', 'value');
  });

  it('should call SecureStore.deleteItemAsync on removeItem', async () => {
    mockSecureStore.deleteItemAsync.mockResolvedValue();
    const storage = createSecureStoreStorage();
    await storage.removeItem('key');
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('key');
  });
});
