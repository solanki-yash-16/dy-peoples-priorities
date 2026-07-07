import { useState, useCallback } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { launchCamera, launchImageLibrary, Asset } from "react-native-image-picker";

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

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission to capture photos.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles via Info.plist
  };

  const capturePhoto = useCallback(async (): Promise<string | null> => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "Camera permission is required to capture photos."
      );
      return null;
    }

    setState((prev) => ({ ...prev, isCapturing: true, error: null }));

    try {
      return new Promise((resolve) => {
        launchCamera(
          {
            mediaType: 'photo',
            quality: 0.8,
            saveToPhotos: false,
          },
          (response) => {
            if (response.didCancel) {
              setState((prev) => ({ ...prev, isCapturing: false }));
              resolve(null);
            } else if (response.errorCode) {
              setState((prev) => ({
                ...prev,
                isCapturing: false,
                error: response.errorMessage || "Camera error",
              }));
              resolve(null);
            } else if (response.assets && response.assets.length > 0) {
              const photoUri = response.assets[0].uri || null;
              setState((prev) => ({
                ...prev,
                isCapturing: false,
                capturedPhoto: photoUri,
                error: null,
              }));
              resolve(photoUri);
            } else {
              setState((prev) => ({ ...prev, isCapturing: false }));
              resolve(null);
            }
          }
        );
      });
    } catch {
      setState((prev) => ({
        ...prev,
        isCapturing: false,
        error: "Failed to capture photo.",
      }));
      return null;
    }
  }, []);

  const pickImage = useCallback(async (): Promise<string | null> => {
    setState((prev) => ({ ...prev, isCapturing: true, error: null }));

    try {
      return new Promise((resolve) => {
        launchImageLibrary(
          {
            mediaType: 'photo',
            quality: 0.8,
            selectionLimit: 1,
          },
          (response) => {
            if (response.didCancel) {
              setState((prev) => ({ ...prev, isCapturing: false }));
              resolve(null);
            } else if (response.errorCode) {
              setState((prev) => ({
                ...prev,
                isCapturing: false,
                error: response.errorMessage || "Gallery error",
              }));
              resolve(null);
            } else if (response.assets && response.assets.length > 0) {
              const photoUri = response.assets[0].uri || null;
              setState((prev) => ({
                ...prev,
                isCapturing: false,
                capturedPhoto: photoUri,
                error: null,
              }));
              resolve(photoUri);
            } else {
              setState((prev) => ({ ...prev, isCapturing: false }));
              resolve(null);
            }
          }
        );
      });
    } catch {
      setState((prev) => ({
        ...prev,
        isCapturing: false,
        error: "Failed to pick photo.",
      }));
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
    pickImage,
    retakePhoto,
    clearPhoto,
  };
};
