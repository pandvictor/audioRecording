import { StyleSheet, View } from 'react-native';

import { AppButton } from '../atoms/AppButton';
import { AppText } from '../atoms/AppText';
import { spacing } from '../../theme/spacing';

type PlaybackControlsProps = {
  isVisible: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
};

export const PlaybackControls = ({
  isVisible,
  isPlaying,
  onTogglePlay,
}: PlaybackControlsProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AppText variant="caption" tone="muted">
        Playback
      </AppText>
      <AppButton
        accessibilityLabel="playback-toggle"
        label={isPlaying ? 'Pause' : 'Play'}
        onPress={onTogglePlay}
        variant="secondary"
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
  },
});
