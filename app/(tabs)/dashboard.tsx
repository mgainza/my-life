import { Text, View } from 'react-native';

export default function DashboardScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-900">
      <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400">
        Dashboard
      </Text>
    </View>
  );
}
