import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'native-base';
import { Platform } from 'react-native';
import { PlusCircle, SoccerBall } from 'phosphor-react-native';

import { New } from '../screens/New';
import { Polls } from '../screens/Polls';
import { Find } from '../screens/Find';
import { Details } from '../screens/Details';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { colors, sizes } = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          position: 'absolute',
          height: 87,
          borderTopWidth: 0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle: {
          position: 'relative',
          top: Platform.OS === 'android' ? -10 : 0
        }
      }}
    >
      <Screen
        name="new"
        component={New}
        options={{
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
          tabBarLabel: 'Novo Bolão'
        }}
      />
      <Screen
        name="polls"
        component={Polls}
        options={{
          tabBarIcon: ({ color, size }) => <SoccerBall color={color} size={size} />,
          tabBarLabel: 'Meus Bolões'
        }}
      />
      <Screen
        name="find"
        component={Find}
        options={{ tabBarButton: () => null }}
      />
      <Screen
        name="details"
        component={Details}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  );
}