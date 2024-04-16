import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

const CalorieTracker = () => {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
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

  const handleBodyWeightChange = (text) => {
    setBodyWeight(text);
  };

  const handleGoalWeightChange = (text) => {
    setGoalWeight(text);
  };

  const handleClearCalories = () => {
    setTotalCalories(0);
  };

  const handleClearProtein = () => {
    setTotalProtein(0);
  };

  const calculateSuggestedProtein = () => {
    if (bodyWeight && goalWeight) {
      const currentBodyWeight = parseFloat(bodyWeight);
      const targetBodyWeight = parseFloat(goalWeight);
      let suggestedProtein;

      if (targetBodyWeight < currentBodyWeight) {
        // Weight loss goal
        suggestedProtein = currentBodyWeight * 0.7;
      } else {
        // Weight gain goal
        suggestedProtein = currentBodyWeight * 1.0;
      }

      return Math.round(suggestedProtein);
    }
    return 0;
  };

  const handleAddCalories = () => {
    const enteredCalories = parseInt(calories, 10);
    const enteredProtein = parseInt(protein, 10);
    if (!isNaN(enteredCalories) && !isNaN(enteredProtein) && food.trim() !== '') {
      // Add the entered calories and protein to the total
      const newTotal = totalCalories + enteredCalories;
      const newTotalProtein = totalProtein + enteredProtein;
      setTotalCalories(newTotal);
      setTotalProtein(newTotalProtein);
      setFoodEntries((prevEntries) => [
        ...prevEntries,
        { food: food.trim(), calories: enteredCalories, protein: enteredProtein },
      ]);
      setFood('');
      setCalories('');
      setProtein('');
    }
  };

  const handleClearFoodEntries = () => {
    setFoodEntries([]);
  };

  const suggestedProtein = calculateSuggestedProtein();

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
      <Text>Protein (g):</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        value={protein}
        onChangeText={handleProteinChange}
        keyboardType="numeric"
      />
      <Text>Body Weight (lbs):</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        value={bodyWeight}
        onChangeText={handleBodyWeightChange}
        keyboardType="numeric"
      />
      <Text>Goal Weight (lbs):</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        value={goalWeight}
        onChangeText={handleGoalWeightChange}
        keyboardType="numeric"
      />
      <Button title="Add Calories & Protein" onPress={handleAddCalories} />
      <View>
        <Text>Total Calories: {totalCalories}</Text>
        <Button title="Clear Calories" onPress={handleClearCalories} />
      </View>
      <View>
        <Text>Total Protein: {totalProtein}g</Text>
        <Button title="Clear Protein" onPress={handleClearProtein} />
      </View>
      <View>
        <Text>Suggested Protein (g): {suggestedProtein}</Text>
      </View>
      <View>
        <Text>Food Entries</Text>
        <FlatList
          data={foodEntries}
          renderItem={({ item }) => (
            <Text>{`${item.food}: ${item.calories} calories, ${item.protein}g protein`}</Text>
          )}
        />
        <Button title="Clear Food Entries" onPress={handleClearFoodEntries} />
      </View>
    </View>
  );
};

export default CalorieTracker;
