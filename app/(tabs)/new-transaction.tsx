import { useState,  useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { View, Text, Pressable, Modal, FlatList, TouchableOpacity, Platform } from 'react-native';
import { fetchCategories, addTransaction } from '../services/database';
import { router } from 'expo-router';
import Input from '@/components/Input';
import { Button } from '@/components/Button';

interface FormData {
  amount: string;
  category: number | null;
  note: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}


export default function TabNewTransactionScreen() {
  // States
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const [formErrors, setFormErrors] = useState<{ [K in keyof FormData]?: string }>({});

  // Load Categories on Focus
  useFocusEffect(
    useCallback(() => {
      const loadCategories = async () => {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);

        // Set the default category to "Default"
        const defaultCategory = fetchedCategories.find(category => category.name === 'Default');
        if (defaultCategory) {
          setSelectedCategory(defaultCategory);
          setFormData(prev => ({ ...prev, category: defaultCategory.id }));
        }
      };
      loadCategories();
    }, [])
  );

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShowDatePicker(Platform.OS === 'ios');
  };

  const showDatepicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: 'date',
        is24Hour: true,
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const [formData, setFormData] = useState<FormData>({
    amount: '',
    category: null,
    note: '',
  });

  const onSubmit = async () => {
    console.log('Form data:', formData);
    const newFormErrors: { [K in keyof FormData]?: string } = {};

    if (!formData.amount) {
      newFormErrors.amount = 'You must enter an amount';
    }

    if (formData.category === null) {
      newFormErrors.category = 'You must select a category';
    }

    setFormErrors(newFormErrors);

    if (Object.keys(newFormErrors).length === 0 && formData.category !== null) {
      try {
        await addTransaction(Number(formData.amount), formData.category, date.toISOString(), formData.note || '');
        setFormData({
          amount: '',
          category: null,
          note: '',
        });
        setDate(new Date());
        router.push('/');
      } catch (error) {
        console.error('Failed to add transaction:', error);
      }
    }
  };

  const onCategoryChange = (selectedCat: Category | null) => {
    console.log('Selected category:', selectedCat);
    setSelectedCategory(selectedCat);
    setModalVisible(false);
    if (selectedCat) {
      setFormData({ ...formData, category: selectedCat.id });
    }
  };

  return (
    <View className='p-3 ctp-latte dark:ctp-mocha flex flex-col gap-3'>
      <Input 
        placeholder='£0.00'
        value={formData.amount}
        onChangeText={(text) => setFormData({ ...formData, amount: text })}
        keyboardType="numeric"
      />
      {formErrors.amount && <Text className='text-ctp-red'>{formErrors.amount}</Text>}

      <Pressable onPress={() => setModalVisible(true)}>
        <View pointerEvents="none">
          <Input
            editable={false}
            value={selectedCategory ? selectedCategory.name : ''}
            placeholder="Select a category"
          />
        </View>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View className="p-5 ctp-latte dark:ctp-mocha bg-ctp-crust flex grow py-20">
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onCategoryChange(item)}>
              <View key={item.id} className='flex flex-row items-center py-3 gap-3'>
                <View className='h-5 w-5 rounded-full' style={{backgroundColor: item.color}} />
                <Text className='text-ctp-text'>{item.name}</Text>
              </View>
            </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      <Input
        onChangeText={(text) => setFormData({ ...formData, note: text })}
        value={formData.note}
        placeholder="Note"
      />

      <Pressable onPress={showDatepicker}>
        <View pointerEvents="none">
          <Input
            editable={false}
            value={date.toLocaleDateString()}
          />
        </View>
      </Pressable>

      <View className='flex flex-row justify-center p-0 -ml-3'>  
        {showDatePicker && (
          <DateTimePicker
            display="spinner"
            accentColor='#c6a0f6'
            className='w-full'
            value={date}
            mode="date"
            onChange={onChange}
          />
        )}
      </View>

      <Button onPress={onSubmit} title='Add Transaction' />

    </View>
  );
}