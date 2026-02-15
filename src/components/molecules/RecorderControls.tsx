import { StyleSheet, View } from 'react-native';

import { AppButton } from '../atoms/AppButton';
import { spacing } from '../../theme/spacing';

type RecorderControlsProps = {
  isRecording: boolean;
  canTranscribe: boolean;
  isTranscribing: boolean;
  onRecord: () => void;
  onStop: () => void;
  onTranscribe: () => void;
  onReset: () => void;
};

export const RecorderControls = ({
  isRecording,
  canTranscribe,
  isTranscribing,
  onRecord,
  onStop,
  onTranscribe,
  onReset,
}: RecorderControlsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <AppButton
          accessibilityLabel="start-recording"
          label={isRecording ? 'Recording...' : 'Record'}
          onPress={onRecord}
          disabled={isRecording || isTranscribing}
          variant="primary"
          style={styles.flex}
        />
        <AppButton
          accessibilityLabel="stop-recording"
          label="Stop"
          onPress={onStop}
          disabled={!isRecording}
          variant="secondary"
          style={styles.flex}
        />
      </View>
      <View style={styles.row}>
        <AppButton
          accessibilityLabel="transcribe-audio"
          label={isTranscribing ? 'Transcribing...' : 'Transcribe'}
          onPress={onTranscribe}
          disabled={!canTranscribe || isRecording || isTranscribing}
          variant="ghost"
          style={styles.flex}
        />
        <AppButton
          accessibilityLabel="reset-recording"
          label="Reset"
          onPress={onReset}
          disabled={isRecording}
          variant="danger"
          style={styles.flex}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
