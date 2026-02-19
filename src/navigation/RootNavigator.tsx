import { useCallback, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { DdRumReactNavigationTracking } from '@datadog/mobile-react-navigation';

import { RecordScreen } from '../screens/RecordScreen';
import { CallsScreen } from '../screens/CallsScreen';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { logEvent } from '../utils/logger';

type RootTabParamList = {
  Record: undefined;
  Calls: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export const RootNavigator = () => {
  const navigationRef = useRef<NavigationContainerRef<RootTabParamList> | null>(null);

  const handleReady = useCallback(() => {
    if (navigationRef.current) {
      DdRumReactNavigationTracking.startTrackingViews(navigationRef.current);
      const route = navigationRef.current.getCurrentRoute();
      if (route) {
        logEvent('screen_view', { screen: route.name });
      }
    }
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleReady}
      onStateChange={() => {
        const route = navigationRef.current?.getCurrentRoute();
        if (route) {
          logEvent('screen_view', { screen: route.name });
        }
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontFamily: typography.fontFamily.medium,
            fontSize: typography.fontSize.sm,
          },
        }}
      >
        <Tab.Screen
          name="Record"
          component={RecordScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="mic" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Calls"
          component={CallsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="phone" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
