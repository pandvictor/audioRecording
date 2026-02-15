import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { AppText } from '../components/atoms/AppText';

export const CallsScreen = () => {
  return (
    <ScreenTemplate>
      <AppText variant="display">Calls</AppText>
      <AppText variant="body" tone="secondary">
        This screen will host VoIP call transcription once we wire the call stack.
      </AppText>
    </ScreenTemplate>
  );
};
