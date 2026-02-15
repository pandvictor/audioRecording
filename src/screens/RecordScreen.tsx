import { useCallback, useEffect } from 'react';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { RecorderPanel } from '../components/organisms/RecorderPanel';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTranscription } from '../hooks/useTranscription';
import { formatDuration } from '../utils/time';

export const RecordScreen = () => {
  const recorder = useAudioRecorder();
  const {
    isPlaying,
    togglePlay,
    stop: stopPlayback,
    reset: resetPlayback,
  } = useAudioPlayer();
  const transcription = useTranscription();

  useEffect(() => {
    if (!recorder.recordingUri) {
      resetPlayback().catch(() => undefined);
    }
  }, [recorder.recordingUri, resetPlayback]);

  const handleRecord = useCallback(async () => {
    transcription.reset();
    await stopPlayback();
    await recorder.startRecording();
  }, [recorder, stopPlayback, transcription]);

  const handleStop = useCallback(async () => {
    await recorder.stopRecording();
  }, [recorder]);

  const handleTranscribe = useCallback(async () => {
    if (!recorder.recordingUri) {
      return;
    }

    await transcription.transcribe(recorder.recordingUri);
  }, [recorder.recordingUri, transcription]);

  const handleReset = useCallback(() => {
    recorder.resetRecording();
    transcription.reset();
    void resetPlayback();
  }, [recorder, resetPlayback, transcription]);

  const statusLabel = recorder.status === 'recording'
    ? 'Recording'
    : transcription.status === 'transcribing'
      ? 'Transcribing'
      : recorder.status === 'stopped'
        ? 'Recorded'
        : recorder.status === 'error' || transcription.status === 'error'
          ? 'Error'
          : transcription.status === 'success'
            ? 'Ready'
            : 'Idle';

  const statusTone = recorder.status === 'recording'
    ? 'recording'
    : transcription.status === 'transcribing'
      ? 'processing'
      : recorder.status === 'error' || transcription.status === 'error'
        ? 'error'
        : transcription.status === 'success'
          ? 'success'
          : 'idle';

  return (
    <ScreenTemplate>
      <RecorderPanel
        statusLabel={statusLabel}
        statusTone={statusTone}
        duration={formatDuration(recorder.durationMs)}
        isRecording={recorder.isRecording}
        canTranscribe={Boolean(recorder.recordingUri)}
        isTranscribing={transcription.status === 'transcribing'}
        transcriptionText={transcription.text}
        transcriptionStatus={transcription.status}
        transcriptionError={recorder.error ?? transcription.error}
        canPlay={Boolean(recorder.recordingUri)}
        isPlaying={isPlaying}
        onTogglePlay={() => {
          if (recorder.recordingUri) {
            togglePlay(recorder.recordingUri);
          }
        }}
        onRecord={handleRecord}
        onStop={handleStop}
        onTranscribe={handleTranscribe}
        onReset={handleReset}
      />
    </ScreenTemplate>
  );
};
