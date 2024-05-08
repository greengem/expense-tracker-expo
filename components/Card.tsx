import { View, Text } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  title?: string;
}

export default function Card({ children, title }: CardProps) {
  return (
    <View className='bg-ctp-surface0 rounded-2xl px-4 py-3 mb-3 flex flex-col gap-0'>
      {title && <Text className='text-ctp-text'>{title}</Text>}
      {children}
    </View>
  );
}