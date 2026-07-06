import { useState, useCallback, useRef } from "react";
import { Platform, PermissionsAndroid, Alert } from "react-native";

interface VoiceRecorderState {
  isRecording: boolean;
  isProcessing: boolean;
  transcription: string;
  duration: number;
  error: string | null;
}

export const useVoiceRecorder = () => {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    isProcessing: false,
    transcription: "",
    duration: 0,
    error: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    if (Platform.OS === "android") {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      if (!hasPermission) {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "This app needs microphone permission to record audio.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (status !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "Microphone permission is required to record audio.");
          return;
        }
      }
    }

    setState((prev) => ({
      ...prev,
      isRecording: true,
      error: null,
      transcription: "",
      duration: 0,
    }));

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setState((prev) => ({
        ...prev,
        duration: prev.duration + 1,
      }));
    }, 1000);
  }, []);

  const stopRecording = useCallback((): Promise<string> => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return new Promise((resolve) => {
      setState((prev) => ({ ...prev, isRecording: false, isProcessing: true }));

      setTimeout(() => {
        const mockTranscriptions = [
          "We need better road connectivity in our village",
          "The primary school building needs urgent repair",
          "Mobile health clinic needed for our hamlet",
          "Street lights required on main market road",
          "Vocational training centre for youth needed",
        ];
        const transcription =
          mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];

        setState((prev) => ({
          ...prev,
          isProcessing: false,
          transcription,
          error: null,
        }));
        resolve(transcription);
      }, 1500);
    });
  }, []);

  const cancelRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isRecording: false,
      isProcessing: false,
      transcription: "",
      duration: 0,
      error: null,
    }));
  }, []);

  const clearTranscription = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcription: "",
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
