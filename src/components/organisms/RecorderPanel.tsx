import { StyleSheet, View } from 'react-native';

import { AppText } from '../atoms/AppText';
import { StatusPill } from '../molecules/StatusPill';
import { TimerDisplay } from '../molecules/TimerDisplay';
import { RecorderControls } from '../molecules/RecorderControls';
import { TranscriptionCard } from '../molecules/TranscriptionCard';
import { PlaybackControls } from '../molecules/PlaybackControls';
import { spacing } from '../../theme/spacing';

type RecorderPanelProps = {
  statusLabel: string;
  statusTone: 'idle' | 'recording' | 'processing' | 'success' | 'error';
  duration: string;
  isRecording: boolean;
  canTranscribe: boolean;
  isTranscribing: boolean;
  transcriptionText: string;
  transcriptionStatus: 'idle' | 'transcribing' | 'success' | 'error';
  transcriptionError?: string | null;
  canPlay: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRecord: () => void;
  onStop: () => void;
  onTranscribe: () => void;
  onReset: () => void;
};

export const RecorderPanel = ({
  statusLabel,
  statusTone,
  duration,
  isRecording,
  canTranscribe,
  isTranscribing,
  transcriptionText,
  transcriptionStatus,
  transcriptionError,
  canPlay,
  isPlaying,
  onTogglePlay,
  onRecord,
  onStop,
  onTranscribe,
  onReset,
}: RecorderPanelProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="display">Voice Studio</AppText>
        <AppText variant="body" tone="secondary">
          Capture audio, then get a clean transcript in seconds.
        </AppText>
      </View>

      <StatusPill label={statusLabel} tone={statusTone} />

      <TimerDisplay label="Recording time" time={duration} />

      <RecorderControls
        isRecording={isRecording}
        canTranscribe={canTranscribe}
        isTranscribing={isTranscribing}
        onRecord={onRecord}
        onStop={onStop}
        onTranscribe={onTranscribe}
        onReset={onReset}
      />

      <PlaybackControls
        isVisible={canPlay}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
      />

      <TranscriptionCard
        text={transcriptionText}
        status={transcriptionStatus}
        errorMessage={transcriptionError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
});
