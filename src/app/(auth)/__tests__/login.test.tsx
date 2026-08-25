import { fireEvent, waitFor } from '@testing-library/react-native';
import { render } from '@/lib/test-utils/render-with-providers';
import Login from '../login';

/**
 * Mocks
 */

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
  useLocalSearchParams: () => ({}),
}));

const handleSignInMock = jest.fn();

/**
 * Tests
 */

describe('Login', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render email and password inputs', async () => {
    const view = await render(<Login />);
    await waitFor(() =>
      expect(view.getByPlaceholderText('Email')).toBeTruthy()
    );
    expect(view.getByPlaceholderText('Password')).toBeTruthy();
  });

  it('should update email and password values on change', async () => {
    const view = await render(<Login />);
    await waitFor(() =>
      expect(view.getByPlaceholderText('Email')).toBeTruthy()
    );
    const emailInput = view.getByPlaceholderText('Email');
    const passwordInput = view.getByPlaceholderText('Password');
    await fireEvent.changeText(emailInput, 'a@b.c');
    await fireEvent.changeText(passwordInput, 'pw');
    await waitFor(() => expect(emailInput.props.value).toBe('a@b.c'));
    await waitFor(() => expect(passwordInput.props.value).toBe('pw'));
  });

  it('should call signIn with email and password on submit', async () => {
    handleSignInMock.mockResolvedValue({ user: null, accessToken: null });
    const view = await render(<Login />, {
      adapter: { signIn: handleSignInMock },
    });
    await waitFor(() =>
      expect(view.getByPlaceholderText('Email')).toBeTruthy()
    );
    await fireEvent.changeText(view.getByPlaceholderText('Email'), 'a@b.c');
    await fireEvent.changeText(view.getByPlaceholderText('Password'), 'pw');
    await fireEvent.press(view.getByText('Sign in'));
    await waitFor(() =>
      expect(handleSignInMock).toHaveBeenCalledWith('a@b.c', 'pw')
    );
  });

  it('should show loading state on the button while submitting', async () => {
    let resolveSignIn: (value: {
      user: null;
      accessToken: null;
    }) => void = () => {};
    handleSignInMock.mockImplementation(
      () =>
        new Promise(resolve => {
          resolveSignIn = resolve;
        })
    );
    const view = await render(<Login />, {
      adapter: { signIn: handleSignInMock },
    });
    await waitFor(() =>
      expect(view.getByPlaceholderText('Email')).toBeTruthy()
    );
    await fireEvent.changeText(view.getByPlaceholderText('Email'), 'a@b.c');
    await fireEvent.changeText(view.getByPlaceholderText('Password'), 'pw');
    // Fire without awaiting so we can assert the loading state before the
    // signIn promise resolves and the button reverts to its idle text.
    void fireEvent.press(view.getByText('Sign in'));
    await waitFor(() => expect(view.queryByText('Sign in')).toBeNull());
    // Release the pending signIn so the test's async chain can settle.
    resolveSignIn({ user: null, accessToken: null });
    await waitFor(() => expect(view.getByText('Sign in')).toBeTruthy());
  });

  it('should display error from signIn when it fails', async () => {
    handleSignInMock.mockRejectedValue(new Error('Invalid credentials'));
    const view = await render(<Login />, {
      adapter: { signIn: handleSignInMock },
    });
    await waitFor(() =>
      expect(view.getByPlaceholderText('Email')).toBeTruthy()
    );
    await fireEvent.changeText(view.getByPlaceholderText('Email'), 'a@b.c');
    await fireEvent.changeText(view.getByPlaceholderText('Password'), 'pw');
    await fireEvent.press(view.getByText('Sign in'));
    await waitFor(() =>
      expect(view.getByText('Invalid credentials')).toBeTruthy()
    );
    await waitFor(() => expect(view.getByText('Sign in')).toBeTruthy());
  });

  it('should announce the error to assistive tech', async () => {
    handleSignInMock.mockRejectedValue(new Error('Invalid credentials'));
    const view = await render(<Login />, {
      adapter: { signIn: handleSignInMock },
    });
    await waitFor(() =>
      expect(view.getByPlaceholderText('Email')).toBeTruthy()
    );
    await fireEvent.changeText(view.getByPlaceholderText('Email'), 'a@b.c');
    await fireEvent.changeText(view.getByPlaceholderText('Password'), 'pw');
    await fireEvent.press(view.getByText('Sign in'));
    const errorNode = await waitFor(() =>
      view.getByText('Invalid credentials')
    );
    expect(errorNode.props.accessibilityRole).toBe('alert');
    expect(errorNode.props.accessibilityLiveRegion).toBe('polite');
  });
});
