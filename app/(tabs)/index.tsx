import { View, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { fetchCurrentBalance, deleteAllData } from '../services/database';
import Card from '@/components/Card';
import { Button } from '@/components/Button';

export default function TabOneScreen() {
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadCurrentBalance = async () => {
        try {
          const balance = await fetchCurrentBalance();
          setCurrentBalance(balance);
        } catch (error) {
          console.error('Failed to fetch current balance:', error);
        }
      };

      loadCurrentBalance();
    }, [])
  );

  // DEBUG: Purge all data and recreate categories
  const handleDeleteAllData = async () => {
    try {
      await deleteAllData();
      setCurrentBalance(null);
    } catch (error) {
      console.error('Failed to delete all data:', error);
    }
  };

  const formattedBalance = currentBalance !== null ? `£${currentBalance.toFixed(2)}` : '£0.00';

  return (
    <View className="p-5 ctp-mocha">
      <Card title='Expenses'>
        <Text className='text-4xl font-semibold text-ctp-text'>{formattedBalance}</Text>
      </Card>
      <Button variant='danger' onPress={handleDeleteAllData} title='Delete all data' />
    </View>
  );
}
