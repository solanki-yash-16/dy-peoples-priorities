import { useState, useCallback } from "react";
import { Platform, PermissionsAndroid } from "react-native";

type PermissionType = "camera" | "microphone" | "location" | "storage";

interface PermissionState {
  camera: boolean;
  microphone: boolean;
  location: boolean;
  storage: boolean;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: false,
    microphone: false,
    location: false,
    storage: false,
  });
  const [isRequesting, setIsRequesting] = useState(false);

  const requestPermission = useCallback(async (type: PermissionType): Promise<boolean> => {
    if (Platform.OS === "ios") {
      setPermissions((prev) => ({ ...prev, [type]: true }));
      return true;
    }

    try {
      setIsRequesting(true);
      const granted = await PermissionsAndroid.request(
        type === "camera"
          ? PermissionsAndroid.PERMISSIONS.CAMERA
          : type === "microphone"
          ? PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
          : type === "location"
          ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Permission`,
          message: `This app needs ${type} permission to function properly.`,
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      setPermissions((prev) => ({ ...prev, [type]: isGranted }));
      return isGranted;
    } catch {
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, []);

  const requestMultiplePermissions = useCallback(
    async (types: PermissionType[]): Promise<PermissionState> => {
      const results = await Promise.all(types.map((type) => requestPermission(type)));
      const newPermissions = { ...permissions };
      types.forEach((type, index) => {
        newPermissions[type] = results[index];
      });
      setPermissions(newPermissions);
      return newPermissions;
    },
    [permissions, requestPermission]
  );

  const checkPermission = useCallback(async (type: PermissionType): Promise<boolean> => {
    if (Platform.OS === "ios") return true;
    const granted = await PermissionsAndroid.check(
      type === "camera"
        ? PermissionsAndroid.PERMISSIONS.CAMERA
        : type === "microphone"
        ? PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        : type === "location"
        ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    setPermissions((prev) => ({ ...prev, [type]: granted }));
    return granted;
  }, []);

  return {
    permissions,
    isRequesting,
    requestPermission,
    requestMultiplePermissions,
    checkPermission,
  };
};
