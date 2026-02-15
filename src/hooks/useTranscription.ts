import { useCallback, useState } from 'react';
import * as FileSystem from 'expo-file-system';

type TranscriptionStatus = 'idle' | 'transcribing' | 'success' | 'error';

const TRANSCRIBE_URL = process.env.EXPO_PUBLIC_TRANSCRIBE_URL;

const getMimeType = (uri: string) => {
  const extension = uri.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'm4a':
      return 'audio/m4a';
    case '3gp':
      return 'audio/3gpp';
    case 'wav':
      return 'audio/wav';
    case 'aac':
      return 'audio/aac';
    case 'mp3':
      return 'audio/mpeg';
    default:
      return 'application/octet-stream';
  }
};

export const useTranscription = () => {
  const [status, setStatus] = useState<TranscriptionStatus>('idle');
  const [text, setText] = useState('Ready when you are.');
  const [error, setError] = useState<string | null>(null);

  const transcribe = useCallback(async (fileUri: string) => {
    setError(null);

    if (!TRANSCRIBE_URL) {
      setStatus('error');
      setError('Set EXPO_PUBLIC_TRANSCRIBE_URL to your transcription API.');
      return;
    }

    try {
      setStatus('transcribing');
      const response = await FileSystem.uploadAsync(TRANSCRIBE_URL, fileUri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        mimeType: getMimeType(fileUri),
      });

      const payload = JSON.parse(response.body || '{}');
      if (!payload.text) {
        throw new Error('Invalid response');
      }

      setText(payload.text);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError('Transcription failed. Check your endpoint.');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setText('Ready when you are.');
    setError(null);
  }, []);

  return {
    status,
    text,
    error,
    transcribe,
    reset,
  };
};
