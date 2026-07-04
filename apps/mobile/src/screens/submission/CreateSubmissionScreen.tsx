import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { VoiceRecorder } from '../../components/VoiceRecorder';
import { CameraCapture } from '../../components/CameraCapture';
import { usePermissions } from '../../hooks/usePermissions';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';

type CreateSubmissionScreenProps = {
  navigation: any;
};

export const CreateSubmissionScreen: React.FC<CreateSubmissionScreenProps> = ({
  navigation,
}) => {
  const [step, setStep] = useState('details');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [_category, _setCategory] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const { requestPermission } = usePermissions();
  const voiceRecorder = useVoiceRecorder();

  const handleVoiceTranscription = (text: string) => {
    setDescription(prev => (prev ? `${prev} ${text}` : text));
    setStep('details');
  };

  const handlePhotoCaptured = (uri: string) => {
    setCapturedPhoto(uri);
    setStep('details');
  };

  const requestCameraPermission = async () => {
    const granted = await requestPermission('camera');
    if (granted) {
      setStep('camera');
    } else {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to capture photos for your submission.',
        [{ text: 'OK' }],
      );
    }
  };

  const requestMicrophonePermission = async () => {
    const granted = await requestPermission('microphone');
    if (granted) {
      setStep('voice');
    } else {
      Alert.alert(
        'Microphone Permission Required',
        'Please grant microphone permission to record voice messages.',
        [{ text: 'OK' }],
      );
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your submission');
      return;
    }
    if (!description.trim()) {
      Alert.alert(
        'Error',
        'Please enter a description or record a voice message',
      );
      return;
    }
    Alert.alert('Success', 'Your submission has been recorded!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const stepIndicator = () => {
    const steps = ['details', 'voice', 'camera'];
    const currentIndex = steps.indexOf(step);
    return (
      <View style={styles.stepIndicator}>
        {steps.map((s, i) => (
          <View key={s} style={styles.stepContainer}>
            <View
              style={[
                styles.stepDot,
                i <= currentIndex
                  ? { backgroundColor: Colors.accent }
                  : { backgroundColor: Colors.slate[300] },
              ]}
            />
            {i < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  {
                    backgroundColor:
                      i < currentIndex ? Colors.accent : Colors.slate[300],
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>New Submission</Text>
            {stepIndicator()}
          </View>

          {step === 'details' && (
            <View style={styles.form}>
              <Input
                label="Title"
                placeholder="Brief title for your suggestion"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />

              <Input
                label="Description"
                placeholder="Describe the development request..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                style={styles.textArea}
              />

              <View style={styles.quickActions}>
                <Button
                  title="🎤 Voice"
                  onPress={requestMicrophonePermission}
                  variant="outline"
                  size="sm"
                  style={styles.quickActionButton}
                />
                <Button
                  title="📷 Photo"
                  onPress={requestCameraPermission}
                  variant="outline"
                  size="sm"
                  style={styles.quickActionButton}
                />
              </View>

              {voiceRecorder.transcription ? (
                <View style={styles.transcriptionPreview}>
                  <Text style={styles.transcriptionLabel}>Voice Input:</Text>
                  <Text style={styles.transcriptionText}>
                    {voiceRecorder.transcription}
                  </Text>
                </View>
              ) : null}

              {capturedPhoto ? (
                <View style={styles.photoPreview}>
                  <Text style={styles.photoLabel}>Photo Attached:</Text>
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoIcon}>📸</Text>
                    <Text style={styles.photoText}>Photo captured</Text>
                  </View>
                </View>
              ) : null}

              <Button
                title="Submit Suggestion"
                onPress={handleSubmit}
                size="lg"
                style={styles.submitButton}
              />
            </View>
          )}

          {step === 'voice' && (
            <VoiceRecorder
              onTranscriptionComplete={handleVoiceTranscription}
              onCancel={() => setStep('details')}
            />
          )}

          {step === 'camera' && (
            <CameraCapture
              onPhotoCaptured={handlePhotoCaptured}
              onCancel={() => setStep('details')}
              existingPhoto={capturedPhoto}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.tabBar,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  backButton: {
    fontSize: Typography.sizes.md,
    color: Colors.accent,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: Spacing.xs,
  },
  form: {
    gap: Spacing.md,
  },
  textArea: {
    minHeight: 120,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickActionButton: {
    flex: 1,
  },
  transcriptionPreview: {
    backgroundColor: Colors.slate[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  transcriptionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  transcriptionText: {
    fontSize: Typography.sizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  photoPreview: {
    backgroundColor: Colors.slate[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photoLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  photoPlaceholder: {
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
  },
  photoIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  photoText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});
