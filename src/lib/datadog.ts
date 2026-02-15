import {
  DatadogProviderConfiguration,
  RumConfiguration,
  TrackingConsent,
} from '@datadog/mobile-react-native';
import {
  ImagePrivacyLevel,
  SessionReplay,
  TextAndInputPrivacyLevel,
  TouchPrivacyLevel,
} from '@datadog/mobile-react-native-session-replay';

const CLIENT_TOKEN = process.env.EXPO_PUBLIC_DD_CLIENT_TOKEN ?? '';
const APPLICATION_ID = process.env.EXPO_PUBLIC_DD_APPLICATION_ID ?? '';
const ENV = process.env.EXPO_PUBLIC_DD_ENV ?? 'dev';
const SITE = process.env.EXPO_PUBLIC_DD_SITE ?? 'US1';
const SERVICE = process.env.EXPO_PUBLIC_DD_SERVICE ?? 'audio-recording';

export const getDatadogConfig = () => {
  if (!CLIENT_TOKEN || !APPLICATION_ID) {
    return null;
  }

  const rumConfig = new RumConfiguration(APPLICATION_ID, true, true, true);
  rumConfig.sessionSampleRate = 100;
  rumConfig.trackFrustrations = true;
  rumConfig.nativeCrashReportEnabled = true;

  const config = new DatadogProviderConfiguration(
    CLIENT_TOKEN,
    ENV,
    TrackingConsent.GRANTED,
  );
  config.site = SITE;
  config.service = SERVICE;
  config.rumConfiguration = rumConfig;

  return config;
};

export const enableSessionReplay = async () => {
  await SessionReplay.enable({
    replaySampleRate: 100,
    textAndInputPrivacyLevel: TextAndInputPrivacyLevel.MASK_SENSITIVE_INPUTS,
    imagePrivacyLevel: ImagePrivacyLevel.MASK_NONE,
    touchPrivacyLevel: TouchPrivacyLevel.SHOW,
  });
};
