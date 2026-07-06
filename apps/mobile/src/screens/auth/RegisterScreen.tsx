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
import { Dropdown } from '../../components/Dropdown';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import { storage } from '../../utils/storage';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { registerSchema } from './validation';

import type { RootStackParamList } from '../../navigation/types';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const ROLE_OPTIONS = [
  { label: 'User', value: 'user' },
  { label: 'Admin', value: 'admin' },
];

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  navigation,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  }>({});
  const [globalError, setGlobalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const setUser = useAuthStore(state => state.setUser);

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async data => {
      await storage.setToken(data.token);
      setUser(data.user);
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Welcome to the app!',
      });
    },
    onError: (err: any) => {
      setGlobalError(err.response?.data?.message || 'Failed to register');
    },
  });

  const handleRegister = () => {
    const result = registerSchema.safeParse({ name, email, password, role });

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        role: fieldErrors.role?.[0],
      });
      return;
    }

    setErrors({});
    setGlobalError('');
    registerMutation.mutate({ name, email, password, role });
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Citizen Dashboard</Text>
          </View>

          <View style={styles.form}>
            {globalError ? (
              <Text style={styles.errorText}>{globalError}</Text>
            ) : null}

            <Input
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={(val) => {
                setName(val);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
            />

            <View style={{ marginBottom: Spacing.md }} />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
              }}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              error={errors.email}
            />

            <View style={{ marginBottom: Spacing.md }} />

            <Input
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
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

            <View style={{marginTop: 20}}>
              <Dropdown
                label="Select Role"
                data={ROLE_OPTIONS}
                value={role}
                onChange={item => {
                  setRole(item.value);
                  if (errors.role) setErrors(prev => ({ ...prev, role: undefined }));
                }}
                error={errors.role}
              />
            </View>
            <Button
              title="Register"
              onPress={handleRegister}
              loading={registerMutation.isPending}
              disabled={registerMutation.isPending}
              size="lg"
              style={styles.registerButton}
            />

            <View style={styles.switchTextContainer}>
              <Text
                style={styles.switchText}
                onPress={() => navigation.goBack()}
              >
                Already have an account?{' '}
                <Text style={styles.switchTextHighlight}>Login</Text>
              </Text>
            </View>
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
    marginBottom: Spacing.xl,
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
  registerButton: {
    marginTop: Spacing.md,
  },
  eyeIcon: {
    fontSize: 20,
  },
  switchTextContainer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  switchText: {
    fontSize: Typography.sizes.md,
    color: Colors.slate[400],
  },
  switchTextHighlight: {
    color: Colors.accent,
    fontWeight: Typography.weights.bold,
  },
});
