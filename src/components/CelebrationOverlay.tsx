import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  AccessibilityInfo,
  Pressable,
} from "react-native";
import LottieView from "lottie-react-native";
import { colors, typography } from "../theme";

interface Props {
  visible: boolean;
  message: string;
  onDone: () => void;
}

export function CelebrationOverlay({ visible, message, onDone }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  // null until we've read the OS setting; gates the confetti so hypervigilant
  // users never get a sudden burst (PRODUCT.md — Accessibility).
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
        // Reduced motion: instant "Done" state, no animation, no confetti.
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
      style={[styles.container, { opacity }]}
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
        style={[styles.bubble, { transform: [{ scale }] }]}
        pointerEvents="none"
      >
        <Text style={styles.paw}>🐾</Text>
        <Text style={styles.message}>{message}</Text>
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
    backgroundColor: "rgba(255,255,255,0.7)",
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
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 36,
    alignItems: "center",
    gap: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  paw: { fontSize: 36 },
  message: {
    ...typography.heading,
    color: colors.primary,
    textAlign: "center",
  },
});
