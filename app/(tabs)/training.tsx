import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TrainingScreen() {
  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText type="title">Training</ThemedText>
    </ThemedView>
  );
}
