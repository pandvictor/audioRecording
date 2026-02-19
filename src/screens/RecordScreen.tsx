import { useCallback, useEffect, useRef } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';

import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { RecorderPanel } from '../components/organisms/RecorderPanel';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTranscription } from '../hooks/useTranscription';
import { formatDuration } from '../utils/time';
import { logEvent } from '../utils/logger';

export const RecordScreen = () => {
  const recorder = useAudioRecorder();
  const { isRecording, recordingUri, stopRecording, resetRecording } = recorder;
  const {
    isPlaying,
    positionMs,
    durationMs,
    togglePlay,
    stop: stopPlayback,
    reset: resetPlayback,
  } = useAudioPlayer();
  const transcription = useTranscription();
  const { reset: resetTranscription } = transcription;
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const pendingCancelPrompt = useRef(false);

  useEffect(() => {
    if (!recordingUri) {
      resetPlayback().catch(() => undefined);
    }
  }, [recordingUri, resetPlayback]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appState.current;
      appState.current = nextState;

      const isLeaving =
        previousState === 'active' && (nextState === 'inactive' || nextState === 'background');
      const isReturning =
        (previousState === 'inactive' || previousState === 'background') && nextState === 'active';

      if (isLeaving && isRecording) {
        pendingCancelPrompt.current = true;
        logEvent('record_interrupted', { screen: 'Record', reason: 'app_close' });
        stopRecording().catch(() => undefined);
      }

      if (isReturning && pendingCancelPrompt.current) {
        pendingCancelPrompt.current = false;
        Alert.alert(
          'Grabación pausada',
          'Saliste de la app mientras grababas. ¿Deseas cancelar la grabación?',
          [
            {
              text: 'Cancelar',
              style: 'destructive',
              onPress: () => {
                logEvent('record_cancel', { screen: 'Record', reason: 'app_close' });
                resetRecording();
                resetTranscription();
              },
            },
            {
              text: 'Mantener',
              onPress: () => {
                logEvent('record_keep', { screen: 'Record', reason: 'app_close' });
              },
            },
          ],
        );
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isRecording, resetRecording, resetTranscription, stopRecording]);

  const handleRecord = useCallback(async () => {
    transcription.reset();
    logEvent('record_start', { screen: 'Record' });
    await stopPlayback();
    await recorder.startRecording();
  }, [recorder, stopPlayback, transcription]);

  const handleStop = useCallback(async () => {
    logEvent('record_stop', { screen: 'Record', durationMs: recorder.durationMs });
    await recorder.stopRecording();
  }, [recorder]);

  const handleTranscribe = useCallback(async () => {
    if (!recorder.recordingUri) {
      return;
    }

    logEvent('transcribe_request', { screen: 'Record' });
    await transcription.transcribe(recorder.recordingUri);
  }, [recorder.recordingUri, transcription]);

  const handleReset = useCallback(() => {
    logEvent('record_reset', { screen: 'Record' });
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
        inputLevel={recorder.inputLevel}
        noiseLevel={recorder.noiseLevel}
        signalLevel={recorder.signalLevel}
        isolationScore={recorder.isolationScore}
        isVoiceProcessingEnabled={recorder.isVoiceProcessingEnabled}
        onToggleVoiceProcessing={(value) => {
          logEvent('voice_processing_toggle', {
            screen: 'Record',
            enabled: value,
          });
          recorder.setVoiceProcessing(value);
        }}
        canPlay={Boolean(recorder.recordingUri)}
        isPlaying={isPlaying}
        playbackPositionMs={positionMs}
        playbackDurationMs={durationMs}
        onTogglePlay={() => {
          if (recorder.recordingUri) {
            logEvent('playback_toggle', {
              screen: 'Record',
              action: isPlaying ? 'pause' : 'play',
            });
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
