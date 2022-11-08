import { createContext, ReactNode, useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { api } from '../services/api';

import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string;
  avatar_url: string;
  email: string;
}

interface AuthState {
  token: string;
  user: UserProps;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [isUserLoading, setIsUserLoading] = useState(false);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      setIsUserLoading(true);
      const [token, user] = await AsyncStorage.multiGet([
        '@nlwcopa:token',
        '@nlwcopa:user',
      ]);

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        setData({ token: token[1], user: JSON.parse(user[1]) });
      }

      setIsUserLoading(false);
    }

    loadStorageData();
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '196694840060-b7h4sko9ckq8sdbgf7uocibqb0ea0qat.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  });

  async function signIn() {
    try {
      setIsUserLoading(true);
      await promptAsync();

    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsUserLoading(false);
    }
  }

  async function signInWithGoogle(access_token: string) {
    try {
      setIsUserLoading(true);

      const tokenResponse = await api.post('/users', { access_token });

      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;

      const userInfoResponse = await api.get('/me');

      await AsyncStorage.multiSet([
        ['@nlwcopa:token', tokenResponse.data.token],
        ['@nlwcopa:user', JSON.stringify(userInfoResponse.data.user)],
      ]);

      setData({
        token: tokenResponse.data.token,
        user: userInfoResponse.data.user
      });

    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsUserLoading(false);
    }

  }

  async function signOut() {
    setData({} as AuthState);
    await AsyncStorage.multiRemove(['@nlwcopa:user', '@nlwcopa:token']);
  }

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  return (
    <AuthContext.Provider value={{
      signIn,
      signOut,
      isUserLoading,
      user: data.user
    }}>
      {children}
    </AuthContext.Provider>
  );
}