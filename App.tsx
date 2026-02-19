import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { DatadogProvider } from '@datadog/mobile-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';
import { enableSessionReplay, getDatadogConfig } from './src/lib/datadog';
import { logEvent } from './src/utils/logger';

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appState.current;
      appState.current = nextState;

      if (previousState === 'active' && (nextState === 'inactive' || nextState === 'background')) {
        logEvent('app_close', { from: previousState, to: nextState });
      }

      if ((previousState === 'inactive' || previousState === 'background') && nextState === 'active') {
        logEvent('app_open', { from: previousState, to: nextState });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const datadogConfig = getDatadogConfig();
  const appContent = <RootNavigator />;

  return (
    <SafeAreaProvider>
      {datadogConfig ? (
        <DatadogProvider
          configuration={datadogConfig}
          onInitialization={() => {
            enableSessionReplay().catch(() => undefined);
          }}
        >
          {appContent}
        </DatadogProvider>
      ) : (
        appContent
      )}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
