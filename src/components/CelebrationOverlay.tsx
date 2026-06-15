import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  AccessibilityInfo,
  Pressable,
} from "react-native";
import LottieView from "lottie-react-native";
import { useThemeColors, typography } from "../theme";

interface Props {
  visible: boolean;
  message: string;
  onDone: () => void;
}

export function CelebrationOverlay({ visible, message, onDone }: Props) {
  const colors = useThemeColors();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);

  useEffect(() => {
    if (!visible) {
      opacity.setValue(0);
      scale.setValue(0.8);
      setReduceMotion(null);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (cancelled) return;
      setReduceMotion(reduced);

      if (reduced) {
        opacity.setValue(1);
        scale.setValue(1);
        timer = setTimeout(onDone, 1000);
        return;
      }

      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
          tension: 180,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(onDone);
      }, 1400);
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { opacity, backgroundColor: colors.celebrationOverlayBg }]}
      accessibilityLiveRegion="polite"
      accessibilityLabel={message}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onDone}
        accessibilityRole="button"
        accessibilityHint="Tap to dismiss"
      />
      {reduceMotion === false && (
        <LottieView
          source={require("../../assets/confetti.json")}
          autoPlay
          loop={false}
          style={styles.confetti}
          pointerEvents="none"
          resizeMode="cover"
        />
      )}

      <Animated.View
        style={[styles.bubble, { backgroundColor: colors.surface, shadowColor: colors.primary, transform: [{ scale }] }]}
        pointerEvents="none"
      >
        <Text style={styles.paw}>🐾</Text>
        <Text style={[styles.message, { color: colors.primary }]}>{message}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  confetti: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 36,
    alignItems: "center",
    gap: 8,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  paw: { fontSize: 36 },
  message: {
    ...typography.heading,
    textAlign: "center",
  },
});
