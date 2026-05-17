import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SleepScreen() {
  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText type="title">Sleep</ThemedText>
    </ThemedView>
  );
}
