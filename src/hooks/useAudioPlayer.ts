import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

export const useAudioPlayer = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeUri, setActiveUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => undefined);
      }
    };
  }, []);

  const togglePlay = useCallback(async (uri: string) => {
    setError(null);
    try {
      if (soundRef.current && activeUri === uri) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
          return;
        }
        await soundRef.current.playAsync();
        setIsPlaying(true);
        return;
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        (status) => {
          if (!status.isLoaded) {
            return;
          }
          setIsPlaying(status.isPlaying);
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        },
      );

      soundRef.current = sound;
      setActiveUri(uri);
      setIsPlaying(true);
    } catch (err) {
      setError('Failed to play audio.');
    }
  }, [activeUri]);

  const stop = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        setIsPlaying(false);
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
      setError(null);
    } catch (err) {
      setError('Failed to reset audio player.');
    }
  }, []);

  return {
    isPlaying,
    activeUri,
    error,
    togglePlay,
    stop,
    reset,
  };
};
