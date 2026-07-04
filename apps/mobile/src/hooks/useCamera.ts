import { useState, useCallback } from "react";
import { Alert, Platform, PermissionsAndroid } from "react-native";

export interface CameraState {
  capturedPhoto: string | null;
  isCapturing: boolean;
  error: string | null;
}

export const useCamera = () => {
  const [state, setState] = useState<CameraState>({
    capturedPhoto: null,
    isCapturing: false,
    error: null,
  });

  const capturePhoto = useCallback(async (): Promise<string | null> => {
    try {
      if (Platform.OS === "android") {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (!hasPermission) {
          const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Camera Permission",
              message: "This app needs camera permission to capture photos.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (status !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("Permission Denied", "Camera permission is required to capture photos.");
            return null;
          }
        }
      }
      setState((prev) => ({ ...prev, isCapturing: true, error: null }));

      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));

      const mockPhotos = [
        "https://images.unsplash.com/photo-1504982200934-3ad037449f9a?w=800",
        "https://images.unsplash.com/photo-1517242810446-cc1b8b530303?w=800",
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
      ];

      const capturedPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];

      setState((prev) => ({
        ...prev,
        isCapturing: false,
        capturedPhoto,
        error: null,
      }));

      return capturedPhoto;
    } catch {
      setState((prev) => ({
        ...prev,
        isCapturing: false,
        capturedPhoto: null,
        error: "Failed to capture photo. Please try again.",
      }));
      Alert.alert("Camera Error", "Failed to capture photo. Please try again.");
      return null;
    }
  }, []);

  const retakePhoto = useCallback(() => {
    setState((prev) => ({
      ...prev,
      capturedPhoto: null,
      error: null,
    }));
  }, []);

  const clearPhoto = useCallback(() => {
    setState((prev) => ({
      ...prev,
      capturedPhoto: null,
      error: null,
    }));
  }, []);

  return {
    ...state,
    capturePhoto,
    retakePhoto,
    clearPhoto,
  };
};
