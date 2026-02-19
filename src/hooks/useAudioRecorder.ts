import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';

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

type VoiceRecorderNativeModule = {
  start: () => Promise<void>;
  stop: () => Promise<string>;
  setVoiceProcessingEnabled: (enabled: boolean) => Promise<void> | void;
};

const nativeRecorder = NativeModules.VoiceRecorder as VoiceRecorderNativeModule | undefined;
const isNativeRecorderAvailable = Boolean(
  nativeRecorder?.start && nativeRecorder?.stop && nativeRecorder?.setVoiceProcessingEnabled,
);

type RecorderStatus = 'idle' | 'recording' | 'stopped' | 'error';

export const useAudioRecorder = () => {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [durationMs, setDurationMs] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputLevel, setInputLevel] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [isVoiceProcessingEnabled, setIsVoiceProcessingEnabled] = useState(true);

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

  const setVoiceProcessing = useCallback(
    async (enabled: boolean) => {
      setIsVoiceProcessingEnabled(enabled);
      if (isNativeRecorderAvailable && Platform.OS !== 'web') {
        await nativeRecorder!.setVoiceProcessingEnabled(enabled);
      }
    },
    [],
  );

  const toggleVoiceProcessing = useCallback(() => {
    void setVoiceProcessing(!isVoiceProcessingEnabled);
  }, [isVoiceProcessingEnabled, setVoiceProcessing]);

  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => undefined);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isNativeRecorderAvailable || Platform.OS === 'web') {
      return;
    }

    const emitter =
      Platform.OS === 'ios'
        ? new NativeEventEmitter(NativeModules.VoiceRecorder)
        : DeviceEventEmitter;

    const subscription = emitter.addListener('voiceRecorderLevel', (event) => {
      const level = Math.min(Math.max(Number(event?.level ?? 0), 0), 1);
      setInputLevel(level);
      setNoiseLevel((prev) => {
        const rise = 0.01;
        const fall = 0.2;
        if (level > prev) {
          return prev + (level - prev) * rise;
        }
        return prev + (level - prev) * fall;
      });
    });

    return () => {
      subscription.remove();
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
      setRecordingUri(null);
      setDurationMs(0);
      setInputLevel(0);
      setNoiseLevel(0);

      if (isNativeRecorderAvailable && Platform.OS !== 'web') {
        await nativeRecorder!.setVoiceProcessingEnabled(isVoiceProcessingEnabled);
        await nativeRecorder!.start();
        startTimestampRef.current = Date.now();
        timerRef.current = setInterval(() => {
          if (startTimestampRef.current) {
            setDurationMs(Date.now() - startTimestampRef.current);
          }
        }, 200);
        setStatus('recording');
        return;
      }

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
      setStatus('recording');
    } catch (err) {
      setStatus('error');
      setError('Failed to start recording.');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      if (isNativeRecorderAvailable && Platform.OS !== 'web') {
        const uri = await nativeRecorder!.stop();
        setRecordingUri(uri || null);
        setStatus('stopped');
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        startTimestampRef.current = null;
        setInputLevel(0);
        setNoiseLevel(0);
        await setPlaybackAudioMode();
        return;
      }

      if (!recordingRef.current) {
        return;
      }

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
    setInputLevel(0);
    setNoiseLevel(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimestampRef.current = null;
    setPlaybackAudioMode().catch(() => undefined);
  }, [setPlaybackAudioMode]);

  return {
    status,
    durationMs,
    recordingUri,
    error,
    inputLevel,
    noiseLevel,
    signalLevel: Math.max(inputLevel - noiseLevel, 0),
    isolationScore: inputLevel > 0 ? Math.max(inputLevel - noiseLevel, 0) / inputLevel : 0,
    isVoiceProcessingEnabled,
    setVoiceProcessing,
    toggleVoiceProcessing,
    isRecording: status === 'recording',
    startRecording,
    stopRecording,
    resetRecording,
  };
};
