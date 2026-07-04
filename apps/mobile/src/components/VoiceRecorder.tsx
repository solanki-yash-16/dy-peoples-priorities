import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Colors, Spacing, BorderRadius, Typography } from "../theme";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionComplete,
  onCancel,
}) => {
  const { isRecording, isProcessing, transcription, duration, startRecording, stopRecording, cancelRecording } =
    useVoiceRecorder();
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isRecording) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isRecording, scaleAnim]);

  const handleStop = async () => {
    const text = await stopRecording();
    if (text) {
      onTranscriptionComplete(text);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Input</Text>
        <Text style={styles.subtitle}>
          {isRecording
            ? "Listening..."
            : isProcessing
              ? "Processing..."
              : "Tap microphone and speak"}
        </Text>
      </View>

      <View style={styles.visualizer}>
        {isRecording && (
          <View style={styles.waveformContainer}>
            {[...Array(5)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.waveformBar,
                  {
                    transform: [
                      {
                        scaleY: scaleAnim.interpolate({
                          inputRange: [1, 1.2],
                          outputRange: [1, 0.5 + Math.random() * 0.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatDuration(duration)}</Text>
      </View>

      {transcription ? (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionLabel}>Transcription:</Text>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      ) : null}

      <View style={styles.controls}>
        {!isRecording && !isProcessing && (
          <TouchableOpacity
            style={styles.recordButton}
            onPress={startRecording}
            activeOpacity={0.8}
          >
            <View style={styles.recordIcon} />
          </TouchableOpacity>
        )}

        {isRecording && (
          <View style={styles.recordingControls}>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleStop}
              activeOpacity={0.8}
            >
              <View style={styles.stopIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                cancelRecording();
                onCancel();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {isProcessing && (
          <View style={styles.processingContainer}>
            <View style={[styles.processingDot, styles.processingDot1]} />
            <View style={[styles.processingDot, styles.processingDot2]} />
            <View style={[styles.processingDot, styles.processingDot3]} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  visualizer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    height: 60,
  },
  waveformBar: {
    width: 4,
    height: 40,
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  timerContainer: {
    marginBottom: Spacing.lg,
  },
  timer: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    fontVariant: ["tabular-nums"],
  },
  transcriptionContainer: {
    backgroundColor: Colors.slate[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: "100%",
    marginBottom: Spacing.lg,
  },
  transcriptionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
  },
  transcriptionText: {
    fontSize: Typography.sizes.md,
    color: Colors.text,
    lineHeight: 22,
  },
  controls: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  recordIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
  },
  recordingControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  stopButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  stopIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.slate[100],
  },
  cancelText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
  processingContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  processingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
    opacity: 0.4,
  },
  processingDot1: {},
  processingDot2: {},
  processingDot3: {},
});
