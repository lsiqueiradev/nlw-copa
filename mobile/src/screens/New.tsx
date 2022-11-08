import { useState } from "react";
import { Heading, Text, useToast, VStack } from "native-base";

import { Header } from "../components/Header";

import Logo from '../assets/logo.svg';
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Keyboard } from "react-native";
import { api } from "../services/api";

export function New() {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  async function handlePollCreate() {
    if (!title.trim()) {
      if (!toast.isActive('error-sign-in')) {
        return toast.show({
          id: 'error-sign-in',
          title: 'Informe um nome para o seu bolão',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
      return;
    }

    try {
      setIsLoading(true);

      await api.post('polls', { title });

      toast.show({
        id: 'error-sign-in',
        title: 'Bolão criado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });

      setTitle('');
      Keyboard.dismiss();

    } catch (err) {
      console.log(err);
      toast.show({
        id: 'error-sign-in',
        title: 'Não foi possível criar o bolão',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);

    }
    setIsLoading(false);

  }

  return (
    <VStack
      flex={1}
      bgColor="gray.900"
    >
      <Header
        title="Criar novo botão"
        showLogoutButton
      />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa {'\n'}
          e compartilhe entre amigos!
        </Heading>
        <Input
          placeholder="Qual o nome do seu bolão?"
          mb={4}
          value={title}
          onChangeText={setTitle}
        />
        <Button
          title="CRIAR MEU BOLÃO"
          onPress={handlePollCreate}
          isLoading={isLoading}
        />

        <Text
          color="gray.200"
          fontSize="sm"
          textAlign="center"
          px={10}
          mt={4}
        >
          Após criar seu bolão, você receberá um código único
          que poderá usar para convidar outras pessoas.
        </Text>
      </VStack>


    </VStack>
  );
} 