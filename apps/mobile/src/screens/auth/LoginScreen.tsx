import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Typography } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import { storage } from '../../utils/storage';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { loginSchema } from './validation';

import type { RootStackParamList } from '../../navigation/types';

export type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [globalError, setGlobalError] = useState('');
  const setUser = useAuthStore(state => state.setUser);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async data => {
      await storage.setToken(data.token);
      setUser(data.user);
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });
      // AppNavigator will automatically route to MainTabs since isAuthenticated is true
    },
    onError: (err: any) => {
      setGlobalError(
        err.response?.data?.message || 'Invalid username or password',
      );
    },
  });

  const handleLogin = async () => {
    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    setGlobalError('');
    loginMutation.mutate({ email: username, password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.slate[900]} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>MP</Text>
            </View>
            <Text style={styles.title}>Citizen Dashboard</Text>
            <Text style={styles.subtitle}>
              Sign in to access development intelligence
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Username"
              placeholder="Enter username"
              value={username}
              onChangeText={val => {
                setUsername(val);
                if (errors.username)
                  setErrors(prev => ({ ...prev, username: undefined }));
              }}
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.username}
            />

            <Input
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={val => {
                setPassword(val);
                if (errors.password)
                  setErrors(prev => ({ ...prev, password: undefined }));
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.password}
              rightIcon={
                <Text style={styles.eyeIcon}>{showPassword ? '👀' : '🙈'}</Text>
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <View style={{ marginTop: Spacing.md }} />
            {globalError ? (
              <Text style={styles.errorText}>{globalError}</Text>
            ) : null}

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loginMutation.isPending}
              disabled={loginMutation.isPending}
              size="lg"
              style={styles.loginButton}
            />

            <View style={styles.switchTextContainer}>
              <Text
                style={styles.switchText}
                onPress={() => navigation.navigate('Register')}
              >
                Don't have an account?{' '}
                <Text style={styles.switchTextHighlight}>Register</Text>
              </Text>
            </View>

            {/* <View style={styles.demoContainer}>
              <Text style={styles.demoText}>Demo credentials:</Text>
              <Text style={styles.demoCredentials}>admin / admin123</Text>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate[900],
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: {
    fontSize: 32,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.slate[400],
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: Spacing.md,
  },
  demoContainer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  demoText: {
    fontSize: Typography.sizes.sm,
    color: Colors.slate[400],
    marginBottom: Spacing.xs,
  },
  demoCredentials: {
    fontSize: Typography.sizes.md,
    color: Colors.slate[300],
    fontWeight: Typography.weights.medium,
  },
  eyeIcon: {
    fontSize: 20,
  },
  switchTextContainer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  switchText: {
    fontSize: Typography.sizes.sm,
    color: Colors.slate[400],
  },
  switchTextHighlight: {
    color: Colors.accent,
    fontWeight: Typography.weights.bold,
  },
});
