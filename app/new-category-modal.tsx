import { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { addCategory } from './services/database';
import { router } from 'expo-router';
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import { labelColors } from "@/components/labelColors";

interface ColorSelectorProps {
  color: string;
  selectedColor: string;
  onSelect: (color: string) => void;
}

const styles = StyleSheet.create({
  colorSelector: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  color: {
    borderRadius: 50,
  },
});

const ColorSelector = ({ color, selectedColor, onSelect }: ColorSelectorProps) => (
  <Pressable onPress={() => onSelect(color)}>
    <View
      className={`h-8 w-8 rounded-full ${color === selectedColor ? 'border-2 border-white' : ''}`}
      style={[styles.colorSelector, { backgroundColor: color === selectedColor ? 'white' : 'transparent' }]}
    >
      <View
        className="h-6 w-6 rounded-full"
        style={[styles.color, { backgroundColor: color ? color : 'transparent' }]}
      />
    </View>
  </Pressable>
);


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


  return (
    <View className="ctp-latte dark:ctp-mocha p-5 flex flex-col gap-5">
      
      <Input
        placeholder='New Category...'
        value={newCategoryName}
        onChangeText={setNewCategoryName}
      />

      <View className="flex flex-row flex-wrap gap-2">
        {labelColors.map((color) => (
          <ColorSelector
            key={color}
            color={color}
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
          />
        ))}
      </View>

      <Button onPress={handleAddCategory} title="Add Category" />
    </View>
  )
}
