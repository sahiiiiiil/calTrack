import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

const CalorieTracker = () => {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [foodEntries, setFoodEntries] = useState([]);

  const handleFoodChange = (text) => {
    setFood(text);
  };

  const handleCaloriesChange = (text) => {
    setCalories(text);
  };

  const handleClearCalories = () => {
    setTotalCalories(0);
  };

  const handleAddCalories = () => {
    const enteredCalories = parseInt(calories, 10);

    if (!isNaN(enteredCalories) && food.trim() !== '') { //if calories is a number and food isn't blank
      // Add the entered calories to the total
      const newTotal = totalCalories + enteredCalories;
      setTotalCalories(newTotal);
      setFoodEntries((prevEntries) => [
        ...prevEntries, //maintain prevEntries in our new created array
        { food: food.trim(), calories: enteredCalories }, //.trim() removes white space from both sides of string
      ]);
      setFood('');
      setCalories('');
    }
  };
  const handleClearFoodEntries = () => {
    setFoodEntries([]);
  }  

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
          renderItem={({ item }) => (
            <Text>{`${item.food}: ${item.calories} calories`}</Text>
          )}
        />
        <Button title="Clear Food Entries" onPress={handleClearFoodEntries} />
      </View>
    </View>
  );
};

export default CalorieTracker;