import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

const CalorieTracker = () => {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [goalProtein, setGoalProtein] = useState(0); // New state for goal protein
  const [foodEntries, setFoodEntries] = useState([]);

  const handleFoodChange = (text) => {
    setFood(text);
  };

  const handleCaloriesChange = (text) => {
    setCalories(text);
  };

  const handleProteinChange = (text) => {
    setProtein(text);
  };

  const handleClearCalories = () => {
    setTotalCalories(0);
  };

  const handleAddCalories = () => {
    const enteredCalories = parseInt(calories, 10);
    const enteredProtein = parseInt(protein, 10); // Parse protein input

    if (!isNaN(enteredCalories) && !isNaN(enteredProtein) && food.trim() !== '') {
      const newTotal = totalCalories + enteredCalories;
      setTotalCalories(newTotal);
      setFoodEntries((prevEntries) => [
        ...prevEntries,
        { food: food.trim(), calories: enteredCalories, protein: enteredProtein }, // Include protein in the entry
      ]);
      setFood('');
      setCalories('');
      setProtein('');
    }
  };

  const handleClearFoodEntries = () => {
    setFoodEntries([]);
  };
  
  return (
    <View style={{ marginTop: 50, padding: 20 }}>
      <Text>Food:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        value={food}
        onChangeText={handleFoodChange}
      />

      <Text>Calories:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        value={calories}
        onChangeText={handleCaloriesChange}
        keyboardType="numeric"
      />

      <Button title="Add Calories" onPress={handleAddCalories} />

      <View>
        <Text>Total Calories: {totalCalories}</Text>
        <Button title="Clear Calories" onPress={handleClearCalories} />
      </View>

      <View>
        <Text>Food Entries</Text>
        <FlatList //use flatlist to render all items
          data={foodEntries}
          renderItem={({ item }) => ( //takes each item in data
            <Text>{`${item.food}: ${item.calories} calories`}</Text>
          )}
        />
        <Button title="Clear Food Entries" onPress={handleClearFoodEntries} />
      </View>
    </View>
  );
};

export default CalorieTracker;