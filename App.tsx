import { StatusBar } from 'expo-status-bar';
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

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

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
