import { useState, useCallback, useRef, useEffect } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

interface VoiceRecorderState {
  isRecording: boolean;
  isProcessing: boolean;
  transcription: string;
  audioUri: string | null;
  duration: number;
  error: string | null;
}

export const useVoiceRecorder = () => {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    isProcessing: false,
    transcription: "",
    audioUri: null,
    duration: 0,
    error: null,
  });

  const audioRecorderPlayer = useRef(AudioRecorderPlayer).current;

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopRecorder().catch(() => {});
      audioRecorderPlayer.removeRecordBackListener();
    };
  }, [audioRecorderPlayer]);

  const requestAudioPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        return grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startRecording = useCallback(async () => {
    try {
      const hasPermission = await requestAudioPermission();
      if (!hasPermission) {
        Alert.alert("Permission Denied", "Microphone permission is required to record audio.");
        return;
      }

      setState((prev) => ({
        ...prev,
        isRecording: true,
        error: null,
        transcription: "",
        audioUri: null,
        duration: 0,
      }));

      await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        setState((prev) => ({
          ...prev,
          duration: Math.floor(e.currentPosition / 1000),
        }));
      });
    } catch (err) {
      console.error('Failed to start recording', err);
      setState(prev => ({ ...prev, error: 'Failed to start recording', isRecording: false }));
    }
  }, [audioRecorderPlayer]);

  const stopRecording = useCallback(async (): Promise<{ transcription: string, uri: string | null }> => {
    setState((prev) => ({ ...prev, isRecording: false, isProcessing: true }));

    try {
      const uri = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();

      // Simulate transcription delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockTranscriptions = [
        "We need better road connectivity in our village",
        "The primary school building needs urgent repair",
        "Mobile health clinic needed for our hamlet",
        "Street lights required on main market road",
        "Vocational training centre for youth needed",
      ];
      const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];

      setState((prev) => ({
        ...prev,
        isProcessing: false,
        transcription,
        audioUri: uri,
        error: null,
      }));
      
      return { transcription, uri };
    } catch (err) {
      console.error('Failed to stop recording', err);
      setState(prev => ({ ...prev, isProcessing: false, error: 'Failed to stop recording' }));
      return { transcription: "", uri: null };
    }
  }, [audioRecorderPlayer]);

  const cancelRecording = useCallback(async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
    } catch {
      // Ignore errors on cancel
    }
    setState((prev) => ({
      ...prev,
      isRecording: false,
      isProcessing: false,
      transcription: "",
      audioUri: null,
      duration: 0,
      error: null,
    }));
  }, [audioRecorderPlayer]);

  const clearTranscription = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcription: "",
      audioUri: null,
      duration: 0,
      error: null,
    }));
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    cancelRecording,
    clearTranscription,
  };
};
