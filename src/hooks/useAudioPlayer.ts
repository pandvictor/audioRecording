import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

export const useAudioPlayer = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeUri, setActiveUri] = useState<string | null>(null);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => undefined);
      }
    };
  }, []);

  const handlePlaybackStatus = useCallback((status: Audio.AVPlaybackStatus) => {
    if (!status.isLoaded) {
      return;
    }
    setIsPlaying(status.isPlaying);
    setPositionMs(status.positionMillis ?? 0);
    setDurationMs(status.durationMillis ?? 0);
    if (status.didJustFinish) {
      setIsPlaying(false);
      setPositionMs(0);
      soundRef.current?.setPositionAsync(0).catch(() => undefined);
    }
  }, []);

  const togglePlay = useCallback(async (uri: string) => {
    setError(null);
    try {
      if (soundRef.current && activeUri === uri) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          setPositionMs(status.positionMillis ?? 0);
          setDurationMs(status.durationMillis ?? 0);
          if (status.isPlaying) {
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
            return;
          }

          const duration = status.durationMillis ?? 0;
          const position = status.positionMillis ?? 0;
          const isAtEnd = duration > 0 && position >= duration - 200;

          if (isAtEnd) {
            await soundRef.current.setPositionAsync(0);
          }

          await soundRef.current.playAsync();
          setIsPlaying(true);
          return;
        }
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        handlePlaybackStatus,
      );

      soundRef.current = sound;
      setActiveUri(uri);
      setIsPlaying(true);
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setPositionMs(status.positionMillis ?? 0);
        setDurationMs(status.durationMillis ?? 0);
      }
    } catch (err) {
      setError('Failed to play audio.');
    }
  }, [activeUri, handlePlaybackStatus]);

  const stop = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        setIsPlaying(false);
        setPositionMs(0);
      }
    } catch (err) {
      setError('Failed to stop audio.');
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      soundRef.current = null;
      setActiveUri(null);
      setIsPlaying(false);
      setPositionMs(0);
      setDurationMs(0);
      setError(null);
    } catch (err) {
      setError('Failed to reset audio player.');
    }
  }, []);

  return {
    isPlaying,
    activeUri,
    positionMs,
    durationMs,
    error,
    togglePlay,
    stop,
    reset,
  };
};
