import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { fetchTransactions, deleteTransaction } from '../services/database';
import { View, Text, ScrollView } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Alert } from 'react-native';
import Card from '@/components/Card';
import { Button } from '@/components/Button';

interface Transaction {
  id: number;
  amount: number;
  category: number;
  categoryName: string;
  date: string;
  note?: string;
}


export default function TabHistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadTransactions = async () => {
        try {
          const loadedTransactions = await fetchTransactions();
          setTransactions(loadedTransactions);
        } catch (error) {
          console.error('Failed to load transactions:', error);
        }
      };
      
      loadTransactions();
    }, [])
  );
  
  const handleDeleteTransaction = (id: number) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              await deleteTransaction(id);
              setTransactions(prev => prev.filter(transaction => transaction.id !== id));
            } catch (error) {
              console.error('Failed to delete transaction:', error);
            }
          } 
        }
      ]
    );
  };

  return (
    <ScrollView className="p-5 ctp-latte dark:ctp-mocha">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <View className='flex flex-row justify-between items-center'>
              <Text className='text-ctp-mauve text-3xl font-semibold'>£{transaction.amount}</Text>
              <Button variant='danger' title='Delete' onPress={() => handleDeleteTransaction(transaction.id)} />
            </View>

            {transaction.note && <Text className='text-ctp-subtext0'>{transaction.note}</Text>}

            <Text className='text-ctp-subtext0'>{transaction.categoryName}</Text>
            <Text className='text-ctp-subtext0'>{format(parseISO(transaction.date), 'dd/MM/yyyy')}</Text>
            
          </Card>
        ))}
    </ScrollView>
  );
}
