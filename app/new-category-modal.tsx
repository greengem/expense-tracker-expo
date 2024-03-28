import { useState } from "react";
import { Pressable, View } from "react-native";
import { addCategory } from './services/database';
import { router } from 'expo-router';
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import clsx from "clsx";

export default function ModalScreen() {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '' || selectedColor.trim() === '') return;
    await addCategory(newCategoryName, selectedColor);
    setNewCategoryName('');
    setSelectedColor('');

    router.back();
  };

  const labelColours = [
    '#f2cdcd', 
    '#f5c2e7', 
    '#cba6f7', 
    '#f38ba8', 
    '#eba0ac', 
    '#fab387', 
    '#f9e2af',
    '#a6e3a1',
    '#94e2d5',
    '#89dceb',
    '#74c7ec',
    '#89b4fa',
    '#b4befe',
  ];

  return (
    <View className="ctp-latte dark:ctp-mocha p-5 flex flex-col gap-5">
      <Input
        placeholder='New Category...'
        value={newCategoryName}
        onChangeText={setNewCategoryName}
      />
      <View className="flex flex-row flex-wrap gap-2">
      {labelColours.map((color) => (
        <Pressable onPress={() => setSelectedColor(color)}>
          <View
            key={color}
            className={clsx("h-6 w-6 rounded-full", {
              'ring-2 ring-white': color === selectedColor,
            })}
            style={{ backgroundColor: color }}
          />
        </Pressable>
      ))}
      </View>
      <Button onPress={handleAddCategory} title="Add Category" />
    </View>
  )
}
