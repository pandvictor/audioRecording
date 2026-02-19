import { StyleSheet, View } from 'react-native';

import { AppText } from '../atoms/AppText';
import { StatusPill } from '../molecules/StatusPill';
import { TimerDisplay } from '../molecules/TimerDisplay';
import { RecorderControls } from '../molecules/RecorderControls';
import { TranscriptionCard } from '../molecules/TranscriptionCard';
import { PlaybackControls } from '../molecules/PlaybackControls';
import { PlaybackTimeline } from '../molecules/PlaybackTimeline';
import { RecordingInsights } from './RecordingInsights';
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
  inputLevel: number;
  noiseLevel: number;
  signalLevel: number;
  isolationScore: number;
  isVoiceProcessingEnabled: boolean;
  onToggleVoiceProcessing: (value: boolean) => void;
  canPlay: boolean;
  isPlaying: boolean;
  playbackPositionMs: number;
  playbackDurationMs: number;
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
  inputLevel,
  noiseLevel,
  signalLevel,
  isolationScore,
  isVoiceProcessingEnabled,
  onToggleVoiceProcessing,
  canPlay,
  isPlaying,
  playbackPositionMs,
  playbackDurationMs,
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

      <RecordingInsights
        inputLevel={inputLevel}
        noiseLevel={noiseLevel}
        signalLevel={signalLevel}
        isolationScore={isolationScore}
        isVoiceProcessingEnabled={isVoiceProcessingEnabled}
        onToggleVoiceProcessing={onToggleVoiceProcessing}
      />

      <PlaybackControls
        isVisible={canPlay}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
      />

      <PlaybackTimeline
        isVisible={canPlay && (isPlaying || playbackPositionMs > 0)}
        positionMs={playbackPositionMs}
        durationMs={playbackDurationMs}
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
