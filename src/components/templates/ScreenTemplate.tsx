import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const ScreenTemplate = ({ children }: PropsWithChildren) => {
  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundAlt]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View pointerEvents="none" style={styles.orbOne} />
      <View pointerEvents="none" style={styles.orbTwo} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  orbOne: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#1F2A44',
    opacity: 0.5,
  },
  orbTwo: {
    position: 'absolute',
    bottom: -140,
    left: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#2B3554',
    opacity: 0.35,
  },
});
