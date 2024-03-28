import { useState, useCallback } from 'react';
import { IconTrash, IconX } from '@tabler/icons-react-native';
import { deleteCategory, fetchCategories } from '../services/database';
import { useFocusEffect } from 'expo-router';
import { ScrollView, View, Text, Alert } from 'react-native';

interface Category {
  id: string;
  name: string;
  color: string;
}

export default function TabCategoryScreen() {
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = useCallback(async () => {
    const fetchedCategories = await fetchCategories();
    setCategories(fetchedCategories);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories])
  );

  const handleDeleteCategory = async (name: string) => {
    await deleteCategory(name);
    loadCategories();
  };

  return (
    <ScrollView className="p-5 ctp-latte dark:ctp-mocha">
        {categories.map((category) => (
          <View key={category.id} className='flex flex-row justify-between items-center py-3'>
            <View className='flex flex-row gap-3 items-center'>
              <View className='h-5 w-5 rounded-full' style={{backgroundColor: category.color}} />
              <Text className='text-ctp-text'>{category.name}</Text>
            </View>
            <IconTrash size={20} onPress={() => handleDeleteCategory(category.name)} />
          </View>
        ))}
    </ScrollView>
  );
}
