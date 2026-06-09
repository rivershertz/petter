import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, AccessibilityInfo } from 'react-native';
import { colors, typography } from '../theme';

interface Props {
  visible: boolean;
  message: string;
  onDone: () => void;
}

export function CelebrationOverlay({ visible, message, onDone }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    let reducedMotion = false;
    AccessibilityInfo.isReduceMotionEnabled().then(v => { reducedMotion = v; });

    if (visible) {
      if (reducedMotion) {
        opacity.setValue(1);
        scale.setValue(1);
        const t = setTimeout(onDone, 1000);
        return () => clearTimeout(t);
      }

      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 180 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      const t = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(onDone);
      }, 1400);
      return () => clearTimeout(t);
    } else {
      opacity.setValue(0);
      scale.setValue(0.8);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { opacity }]}
      accessibilityLiveRegion="polite"
      accessibilityLabel={message}
    >
      <Animated.View style={[styles.bubble, { transform: [{ scale }] }]}>
        <Text style={styles.paw}>🐾</Text>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>

      {/* Confetti particles */}
      <Particles />
    </Animated.View>
  );
}

function Particles() {
  const PARTICLES = [
    { color: colors.celebrationPeach, top: '20%', left: '10%' },
    { color: colors.celebrationSage, top: '25%', right: '12%' },
    { color: colors.celebrationSky, top: '60%', left: '15%' },
    { color: colors.celebrationYellow, top: '55%', right: '10%' },
    { color: colors.primary, top: '35%', left: '5%' },
    { color: colors.accent, top: '40%', right: '5%' },
  ];

  return (
    <>
      {PARTICLES.map((p, i) => (
        <AnimatedParticle key={i} color={p.color} style={{ top: p.top, left: p.left, right: p.right }} delay={i * 80} />
      ))}
    </>
  );
}

function AnimatedParticle({ color, style, delay }: { color: string; style: object; delay: number }) {
  const y = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(y, { toValue: -60, duration: 800, useNativeDriver: true }),
      ]),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        style as any,
        { backgroundColor: color, transform: [{ translateY: y }], opacity },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 200,
  },
  bubble: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 36,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
