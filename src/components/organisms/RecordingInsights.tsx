import { StyleSheet, View } from 'react-native';

import { AppText } from '../atoms/AppText';
import { Card } from '../atoms/Card';
import { LevelBar } from '../molecules/LevelBar';
import { ToggleRow } from '../molecules/ToggleRow';
import { spacing } from '../../theme/spacing';

type RecordingInsightsProps = {
  inputLevel: number;
  noiseLevel: number;
  signalLevel: number;
  isolationScore: number;
  isVoiceProcessingEnabled: boolean;
  onToggleVoiceProcessing: (value: boolean) => void;
};

export const RecordingInsights = ({
  inputLevel,
  noiseLevel,
  signalLevel,
  isolationScore,
  isVoiceProcessingEnabled,
  onToggleVoiceProcessing,
}: RecordingInsightsProps) => {
  const isolationPercent = Math.round(isolationScore * 100);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="subtitle">Voice Isolation</AppText>
        <AppText variant="caption" tone="muted">
          {isolationPercent}% clarity
        </AppText>
      </View>

      <ToggleRow
        label="Voice processing"
        value={isVoiceProcessingEnabled}
        onValueChange={onToggleVoiceProcessing}
      />
      <AppText variant="caption" tone="muted">
        Changes apply to the next take.
      </AppText>

      <LevelBar label="Voice level" value={inputLevel} tone="accent" />
      <LevelBar label="Noise level" value={noiseLevel} tone="danger" />
      <LevelBar label="Signal vs noise" value={signalLevel} tone="success" />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
