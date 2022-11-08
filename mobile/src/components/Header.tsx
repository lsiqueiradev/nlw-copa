import { useNavigation } from '@react-navigation/native';
import { Text, HStack, Box } from 'native-base';
import { CaretLeft, Export, SignOut } from 'phosphor-react-native';
import { useAuth } from '../hooks/useAuth';

import { ButtonIcon } from './ButtonIcon';

interface Props {
  title: string;
  showBackButton?: boolean;
  showShareButton?: boolean;
  showLogoutButton?: boolean;
  onShare?: () => void;
}

export function Header({ title, showBackButton = false, showLogoutButton = false, showShareButton = false, onShare }: Props) {
  const { navigate } = useNavigation();
  const EmptyBoxSpace = () => (<Box w={6} h={6} />);
  const { signOut } = useAuth();

  function renderLeftHeaderOptions() {
    if (showBackButton) {
      return <ButtonIcon icon={CaretLeft} onPress={() => navigate('polls')} />;
    }

    return <EmptyBoxSpace />;
  }

  function renderRightHeaderOptions() {
    if (showShareButton) {
      return <ButtonIcon icon={Export} onPress={onShare} />;
    }

    if (showLogoutButton) {
      return <ButtonIcon icon={SignOut} onPress={() => signOut()} />;
    }

    return <EmptyBoxSpace />;
  }

  return (
    <HStack w="full" h={24} bgColor="gray.800" alignItems="flex-end" pb={5} px={5}>
      <HStack w="full" alignItems="center" justifyContent="space-between">
        {renderLeftHeaderOptions()}

        <Text color="white" fontFamily="medium" fontSize="md" textAlign="center">
          {title}
        </Text>

        {renderRightHeaderOptions()}
      </HStack>
    </HStack>
  );
}