import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { withUnistyles } from 'react-native-unistyles';
import { testIds } from '@reward-goals/test-ids';

import { ApiError } from '@/api/errors';
import { Button } from '@/ui/components/Button';
import { Card } from '@/ui/components/Card';
import { Screen } from '@/ui/components/Screen';
import { SecureTextInput } from '@/ui/components/SecureTextInput';
import { Text } from '@/ui/components/Text';
import { TextInput } from '@/ui/components/TextInput';

import { useRegisterMutation } from '@/features/auth/hooks/useRegisterMutation';
import {
  registerFormSchema,
  type RegisterFormValues,
} from '@/features/auth/utils/register-form-schema';
import { styles } from './RegisterScreen.styles';

const ThemedImage = withUnistyles(Image);

export const RegisterScreen = () => {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: { confirmPassword: '', email: '', password: '' },
    resolver: zodResolver(registerFormSchema),
  });
  const serverError = registerMutation.error
    ? ApiError.fromUnknown(registerMutation.error).message
    : null;

  const handleRegistrationSuccess = () => {
    router.replace({ pathname: '/login', params: { registered: '1' } });
  };
  const handleSignInPress = () => {
    router.replace('/login');
  };
  const submit = handleSubmit(({ email, password }) => {
    registerMutation.register(
      { email, password },
      {
        onSuccess: handleRegistrationSuccess,
      },
    );
  });

  return (
    <Screen
      contentContainerStyle={styles.content}
      testID={testIds.auth.register.screen}
    >
      <View style={styles.hero}>
        <ThemedImage
          accessible={false}
          contentFit="contain"
          source={require('../../../../assets/images/auth/register-reward-hero.png')}
          style={styles.heroImage}
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.title} variant="heading">
          Create your account
        </Text>
        <Text style={styles.subtitle} tone="muted">
          Start building consistency today.
        </Text>
      </View>

      <Card padding="large" style={styles.card} variant="elevated">
        {serverError ? (
          <Text accessibilityRole="alert" tone="danger">
            {serverError}
          </Text>
        ) : null}

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email?.message}
                keyboardType="email-address"
                label="Email"
                leadingIcon="email-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter your email"
                returnKeyType="next"
                testID={testIds.auth.register.emailInput}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onBlur, onChange, value } }) => (
              <SecureTextInput
                autoCapitalize="none"
                autoComplete="new-password"
                error={errors.password?.message}
                hint="Use 8–128 characters."
                label="Password"
                leadingIcon="lock-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter your password"
                returnKeyType="next"
                testID={testIds.auth.register.passwordInput}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onBlur, onChange, value } }) => (
              <SecureTextInput
                autoCapitalize="none"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                label="Confirm password"
                leadingIcon="lock-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                onSubmitEditing={submit}
                placeholder="Confirm your password"
                returnKeyType="done"
                testID={testIds.auth.register.confirmPasswordInput}
                value={value}
              />
            )}
          />
        </View>

        <View style={styles.actions}>
          <Button
            label="Create account"
            loading={registerMutation.isPending}
            onPress={submit}
            size="large"
            testID={testIds.auth.register.submitButton}
          />
        </View>
      </Card>

      <View style={styles.signInPrompt}>
        <Text>Already have an account?</Text>
        <Button
          disabled={registerMutation.isPending}
          label="Sign in"
          onPress={handleSignInPress}
          size="small"
          style={styles.signInButton}
          variant="ghost"
        />
      </View>
    </Screen>
  );
};
