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
import { useMutation } from '@tanstack/react-query';
import { complaintApi } from '../../api/complaint';
import Toast from 'react-native-toast-message';
import { submissionSchema } from './submissionSchema';
import Geolocation from 'react-native-geolocation-service';

type CreateSubmissionScreenProps = {
  navigation: any;
};

export const CreateSubmissionScreen: React.FC<CreateSubmissionScreenProps> = ({
  navigation,
}) => {
  const [step, setStep] = useState('details');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    village: '',
    district: '',
    state: '',
    country: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedAudio, setCapturedAudio] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const { requestPermission } = usePermissions();
  const voiceRecorder = useVoiceRecorder();

  const submitComplaintMutation = useMutation({
    mutationFn: complaintApi.submitComplaint,
    onSuccess: (data) => {
      if (data?.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Your submission has been recorded!',
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again.',
        });
      }
    },
    onError: (error) => {
      console.error('Submission error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to submit complaint. Please try again.',
      });
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleVoiceTranscription = (text: string, audioUri: string | null) => {
    handleChange('description', formData.description ? `${formData.description} ${text}` : text);
    if (audioUri) {
      setCapturedAudio(audioUri);
    }
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

  const fetchCurrentLocation = async () => {
    const granted = await requestPermission('location');
    if (!granted) {
      Alert.alert(
        'Location Permission Required',
        'Please grant location permission to fetch your current coordinates.',
        [{ text: 'OK' }],
      );
      return;
    }

    setIsFetchingLocation(true);
    Geolocation.getCurrentPosition(
      (position) => {
        setCoordinates([position.coords.longitude, position.coords.latitude]);
        setIsFetchingLocation(false);
        Toast.show({
          type: 'success',
          text1: 'Location Fetched',
          text2: 'Your coordinates have been recorded.',
        });
      },
      (error) => {
        console.error(error);
        setIsFetchingLocation(false);
        Alert.alert('Location Error', 'Unable to fetch your location. Please try again.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleSubmit = async () => {
    const result = submissionSchema.safeParse(formData);
    
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(formattedErrors);
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all required fields correctly.',
      });
      return;
    }

    if (!coordinates) {
      Toast.show({
        type: 'error',
        text1: 'Location Required',
        text2: 'Please fetch your current location before submitting.',
      });
      return;
    }
    
    setIsUploading(true);
    try {
      let mediaArray: Array<{ url: string; type: string }> = [];

      const BASE_URL = 'https://dy-peoples-priorities.onrender.com';

      if (capturedPhoto) {
        const imageRes = await complaintApi.uploadImage(capturedPhoto);
        if (imageRes?.url) {
          mediaArray.push({
            url: imageRes.url.startsWith('http') ? imageRes.url : `${BASE_URL}${imageRes.url}`,
            type: 'IMAGE',
          });
        }
      }

      if (capturedAudio) {
        const audioRes = await complaintApi.uploadAudio(capturedAudio);
        if (audioRes?.url) {
          mediaArray.push({
            url: audioRes.url.startsWith('http') ? audioRes.url : `${BASE_URL}${audioRes.url}`,
            type: 'VOICE',
          });
        }
      }
      
      const requestBody = {
        description: {
          originalText: formData.description,
          languageCode: "en"
        },
        location: {
          type: "Point",
          coordinates: coordinates,
          address: formData.address,
          village: formData.village,
          district: formData.district,
          state: formData.state,
          country: formData.country
        },
        media: mediaArray
      };

      submitComplaintMutation.mutate(requestBody as any);
    } catch (error) {
      console.error('Upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: 'Failed to upload media files. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
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
                value={formData.title}
                onChangeText={(val) => handleChange('title', val)}
                error={errors.title}
                maxLength={100}
              />

              <Input
                label="Description"
                placeholder="Describe the development request..."
                value={formData.description}
                onChangeText={(val) => handleChange('description', val)}
                error={errors.description}
                multiline
                numberOfLines={6}
                style={styles.textArea}
              />
              
              <Text style={styles.sectionTitle}>Location Details</Text>
              
              <Button
                title={coordinates ? "📍 Location Recorded" : "📍 Fetch Current Location"}
                onPress={fetchCurrentLocation}
                variant={coordinates ? "secondary" : "outline"}
                size="sm"
                loading={isFetchingLocation}
                style={styles.locationButton}
              />
              
              <Input
                label="Address"
                placeholder="E.g. Near Government School"
                value={formData.address}
                onChangeText={(val) => handleChange('address', val)}
                error={errors.address}
              />
              
              <Input
                label="Village / Ward"
                placeholder="E.g. Karol Bagh"
                value={formData.village}
                onChangeText={(val) => handleChange('village', val)}
                error={errors.village}
              />
              
              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Input
                    label="District"
                    placeholder="E.g. New Delhi"
                    value={formData.district}
                    onChangeText={(val) => handleChange('district', val)}
                    error={errors.district}
                  />
                </View>
                <View style={styles.spacing} />
                <View style={styles.flex1}>
                  <Input
                    label="State"
                    placeholder="E.g. Delhi"
                    value={formData.state}
                    onChangeText={(val) => handleChange('state', val)}
                    error={errors.state}
                  />
                </View>
              </View>
              
              <Input
                label="Country"
                placeholder="E.g. India"
                value={formData.country}
                onChangeText={(val) => handleChange('country', val)}
                error={errors.country}
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

              {voiceRecorder.transcription || capturedAudio ? (
                <View style={styles.transcriptionPreview}>
                  <Text style={styles.transcriptionLabel}>Voice Input:</Text>
                  {voiceRecorder.transcription ? (
                    <Text style={styles.transcriptionText}>
                      {voiceRecorder.transcription}
                    </Text>
                  ) : null}
                  {capturedAudio ? (
                    <Text style={[styles.transcriptionText, { marginTop: 4, color: Colors.accent }]}>
                      🎙️ Audio clip attached
                    </Text>
                  ) : null}
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
                loading={submitComplaintMutation.isPending || isUploading}
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
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
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
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  spacing: {
    width: Spacing.md,
  },
  textArea: {
    minHeight: 120,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
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
  locationButton: {
    marginBottom: Spacing.sm,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});
