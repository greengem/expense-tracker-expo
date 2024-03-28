import { useState,  useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, Pressable } from 'react-native';
import { fetchCategories, addTransaction } from '../services/database';
import { router } from 'expo-router';
import Input from '@/components/Input';
import {Picker} from '@react-native-picker/picker';
import { Button } from '@/components/Button';

interface FormData {
  amount: string;
  category: number | null;
  note: string;
}

interface Category {
  id: number;
  name: string;
}

export default function TabNewTransactionScreen() {
  const [date, setDate] = useState(new Date());
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCatPicker, setShowCatPicker] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset, trigger, setError } = useForm<FormData>({
    defaultValues: {
      amount: '',
      category: null,
      note: '',
    }
  });
  

  useFocusEffect(
    useCallback(() => {
      const loadCategories = async () => {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      };
      loadCategories();
    }, [])
  );

  const onSubmit = async (data: FormData) => {
    console.log('Form data:', data);
    const isFormValid = await trigger();
    if (data.category === null) {
      setError('category', {
        type: 'manual',
        message: 'You must select a category',
      });
      return;
    }
  
    if (isFormValid) {
      try {
        await addTransaction(Number(data.amount), data.category, date.toISOString(), data.note || '');
        reset();
        setDate(new Date());
        router.push('/');
      } catch (error) {
        console.error('Failed to add transaction:', error);
      }
    }
  };

  const togglePicker = () => {
    console.log('Toggling picker');
    setShowCatPicker(prevState => !prevState);
  };
  

  return (
    <View className='p-3 ctp-latte dark:ctp-mocha flex flex-col gap-3'>

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input 
            placeholder='£0.00'
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
        name="amount"
        rules={{ required: 'You must enter an amount' }}
      />
      {errors.amount && <Text className='text-ctp-red'>{errors.amount.message}</Text>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Note"
          />
        )}
        name="note"
      />
      <Pressable onPress={togglePicker}>
        <Input 
          editable={false}
        />
      </Pressable>

      {showCatPicker && (
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Picker
            selectedValue={value}
            onValueChange={(itemValue, itemIndex) => {
              onChange(itemValue);
              setShowCatPicker(false);
            }}
            onBlur={onBlur}
          >
            {categories.map((category) => (
              <Picker.Item color='white' label={category.name} value={category.id.toString()} key={category.id.toString()} />
            ))}
          </Picker>
        )}
        name="category"
      />
      )}

      <View className='flex flex-row justify-center p-0 -ml-3'>
        <DateTimePicker
          className='w-full'
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setDate(currentDate);
          }}
        />
      </View>


      <Button onPress={handleSubmit(onSubmit)} title='Add Transaction' />
    </View>
  );
}