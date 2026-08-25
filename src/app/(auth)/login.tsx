import { useState, type FunctionComponent } from 'react';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Stack } from '@/components/ui/stack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/core/auth';

/**
 * Helpers
 */

const targetFor = (redirect: string | undefined): Href =>
  (redirect as Href) || ('/inicio' as Href);

/**
 * Login
 */

const Login: FunctionComponent = () => {
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { signIn, error, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    router.replace(targetFor(redirect));
    return null;
  }

  const handleSubmit = async (): Promise<void> => {
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.replace(targetFor(redirect));
    } catch {
      // error surfaced via context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Stack gap="three" style={{ paddingHorizontal: 16, paddingTop: 64 }}>
        <Text variant="display">Replay</Text>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          testID="email-input"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          testID="password-input"
        />
        {error && (
          <Text
            color="destructive"
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {error}
          </Text>
        )}
        <Button
          variant="primary"
          onPress={handleSubmit}
          loading={submitting}
          testID="sign-in-button"
        >
          Sign in
        </Button>
      </Stack>
    </Screen>
  );
};

export default Login;
