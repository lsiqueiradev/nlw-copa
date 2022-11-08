import { NavigationContainer } from '@react-navigation/native';
import { Box } from 'native-base';

import { useAuth } from '../hooks/useAuth';

import { AppRoutes } from './app.routes';
import { SignIn } from '../screens/SignIn';
import { Loading } from '../components/Loading';

export function Routes() {
  const { user, isUserLoading } = useAuth();

  if (isUserLoading) {
    return <Loading />
  }

  return (
    <Box
      flex={1}
      bg="gray.900"
    >
      <NavigationContainer>
        {user ? <AppRoutes /> : <SignIn />}
      </NavigationContainer>
    </Box>
  );
}