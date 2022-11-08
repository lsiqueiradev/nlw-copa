import { useState, useCallback } from 'react';
import { FlatList, Icon, useToast, VStack } from 'native-base';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { Octicons } from '@expo/vector-icons';

import { api } from '../services/api';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PollCard, PollCardProps } from '../components/PollCard';
import { EmptyPollList } from '../components/EmptyPollList';

export function Polls() {
  const [polls, setPolls] = useState<PollCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();
  const { navigate } = useNavigation();

  async function fetchPolls() {
    try {
      setIsLoading(true);
      const { data } = await api.get('/polls');

      setPolls(data.polls);

    } catch (err) {
      console.log(err);

      toast.show({
        title: 'Não foi possível carregas os bolões',
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title="Meus Bolões"
        showLogoutButton
      />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate('find')}
        />

      </VStack>
      {isLoading ? <Loading /> :
        <FlatList
          data={polls}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PollCard
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPollList />}
        />
      }
    </VStack>
  )
}