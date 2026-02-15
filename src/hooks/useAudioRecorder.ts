import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

const VOICE_RECORDING_OPTIONS: Audio.RecordingOptions = {
  isMeteringEnabled: true,
  android: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 64000,
  },
  ios: {
    extension: '.m4a',
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 64000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: Audio.RecordingOptionsPresets.HIGH_QUALITY.web,
};

type RecorderStatus = 'idle' | 'recording' | 'stopped' | 'error';

export const useAudioRecorder = () => {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [durationMs, setDurationMs] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setRecordingAudioMode = useCallback(async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  }, []);

  const setPlaybackAudioMode = useCallback(async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });
  }, []);

  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => undefined);
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      setStatus('error');
      setError('Microphone permission is required.');
      return;
    }

    try {
      await setRecordingAudioMode();

      const recording = new Audio.Recording();
      recordingRef.current = recording;

      recording.setOnRecordingStatusUpdate((update) => {
        if (update.isRecording) {
          setDurationMs(update.durationMillis ?? 0);
        }
      });

      await recording.prepareToRecordAsync(VOICE_RECORDING_OPTIONS);
      await recording.startAsync();
      setRecordingUri(null);
      setDurationMs(0);
      setStatus('recording');
    } catch (err) {
      setStatus('error');
      setError('Failed to start recording.');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) {
      return;
    }

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      setRecordingUri(uri ?? null);
      setStatus('stopped');
      await setPlaybackAudioMode();
    } catch (err) {
      setStatus('error');
      setError('Failed to stop recording.');
    } finally {
      recordingRef.current = null;
    }
  }, [setPlaybackAudioMode]);

  const resetRecording = useCallback(() => {
    setStatus('idle');
    setDurationMs(0);
    setRecordingUri(null);
    setError(null);
    setPlaybackAudioMode().catch(() => undefined);
  }, [setPlaybackAudioMode]);

  return {
    status,
    durationMs,
    recordingUri,
    error,
    isRecording: status === 'recording',
    startRecording,
    stopRecording,
    resetRecording,
  };
};
