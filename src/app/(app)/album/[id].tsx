import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams } from 'expo-router';

/**
 * AlbumDetailScreen
 */

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <Text variant="heading">Album {id}</Text>
    </Screen>
  );
}
