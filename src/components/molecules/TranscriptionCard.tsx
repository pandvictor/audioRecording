import { StyleSheet, View } from 'react-native';

import { AppText } from '../atoms/AppText';
import { Card } from '../atoms/Card';
import { spacing } from '../../theme/spacing';

type TranscriptionCardProps = {
  text: string;
  status?: 'idle' | 'transcribing' | 'success' | 'error';
  errorMessage?: string | null;
};

export const TranscriptionCard = ({
  text,
  status = 'idle',
  errorMessage,
}: TranscriptionCardProps) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="subtitle">Transcription</AppText>
        <AppText variant="caption" tone="muted">
          {status === 'transcribing'
            ? 'Processing...'
            : status === 'error'
              ? 'Failed'
              : status === 'success'
                ? 'Ready'
                : 'Waiting'}
        </AppText>
      </View>
      {status === 'error' && errorMessage ? (
        <AppText variant="body" tone="danger">
          {errorMessage}
        </AppText>
      ) : (
        <AppText variant="body" tone="secondary">
          {text}
        </AppText>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  header: {
    gap: spacing.xxs,
  },
});
