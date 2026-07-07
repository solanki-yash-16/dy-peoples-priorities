import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { Colors, Spacing, BorderRadius, Typography } from "../theme";
import { useCamera } from "../hooks/useCamera";

interface CameraCaptureProps {
  onPhotoCaptured: (uri: string) => void;
  onCancel: () => void;
  existingPhoto?: string | null;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoCaptured,
  onCancel,
  existingPhoto,
}) => {
  const { capturedPhoto, isCapturing, capturePhoto, retakePhoto, pickImage } = useCamera();
  const [flashOn, setFlashOn] = useState(false);

  const handleCapture = async () => {
    const photo = await capturePhoto();
    if (photo) {
      onPhotoCaptured(photo);
    }
  };

  const handleRetake = () => {
    retakePhoto();
  };

  const displayPhoto = existingPhoto || capturedPhoto;

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {displayPhoto ? (
          <Image source={{ uri: displayPhoto }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>No photo captured</Text>
            <Text style={styles.placeholderSubtext}>
              Tap the button below to capture
            </Text>
          </View>
        )}

        {displayPhoto && (
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.flashButton}
              onPress={() => setFlashOn(!flashOn)}
            >
              <Text style={styles.flashText}>{flashOn ? "⚡" : "🔅"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        {displayPhoto ? (
          <View style={styles.capturedControls}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={handleRetake}
              activeOpacity={0.8}
            >
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.usePhotoButton}
              onPress={() => displayPhoto && onPhotoCaptured(displayPhoto)}
              activeOpacity={0.8}
            >
              <Text style={styles.usePhotoText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.captureControls}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={async () => {
                const photo = await pickImage();
                if (photo) {
                  onPhotoCaptured(photo);
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.galleryText}>🖼️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
              disabled={isCapturing}
              activeOpacity={0.8}
            >
              <View style={styles.captureOuter}>
                <View
                  style={[
                    styles.captureInner,
                    isCapturing && styles.capturingInner,
                  ]}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {isCapturing && (
        <View style={styles.capturingOverlay}>
          <Text style={styles.capturingText}>Capturing...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.slate[900],
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  placeholderText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  placeholderSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  flashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  flashText: {
    fontSize: 20,
  },
  controls: {
    // backgroundColor: Colors.black,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
        backgroundColor: Colors.slate[900],

  },
  captureControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.slate[800],
    alignItems: "center",
    justifyContent: "center",
  },
  galleryText: {
    fontSize: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  captureOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
  },
  capturingInner: {
    opacity: 0.6,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.slate[800],
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  capturedControls: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  retakeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.slate[800],
    alignItems: "center",
  },
  retakeText: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  usePhotoButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accent,
    alignItems: "center",
  },
  usePhotoText: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  capturingOverlay: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    alignItems: "center",
    marginTop: -20,
  },
  capturingText: {
    color: Colors.white,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
  },
});
