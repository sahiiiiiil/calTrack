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

  const handleClearFoodEntries = () => {
    setFoodEntries([]);
  };

  const calculateSuggestedProtein = () => {
    if (bodyWeight && goalWeight) {
      const currentBodyWeight = parseFloat(bodyWeight);
      const targetBodyWeight = parseFloat(goalWeight);
      let suggestedProtein;

      if (targetBodyWeight < currentBodyWeight) {
        suggestedProtein = currentBodyWeight * 0.7;
      } else {
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

  const suggestedProtein = calculateSuggestedProtein();

  return (
    <View style={{ marginTop: 100, padding: 20 }}>
      <View
        style={{
          alignItems: 'center',
          marginVertical: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Food Entries
        </Text>
        <FlatList
          data={foodEntries}
          renderItem={({ item }) => (
            <Text
              style={{
                fontSize: 16,
              }}
            >{`${item.food}: ${item.calories} calories, ${item.protein}g protein`}</Text>
          )}
        />
        <Button
          title="Clear Food Entries"
          onPress={handleClearFoodEntries}
          style={{
            alignSelf: 'center',
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            Body Weight (lbs):
          </Text>
          <TextInput
            style={{
              height: 40,
              width: 150,
              borderColor: 'gray',
              borderWidth: 1,
            }}
            value={bodyWeight}
            onChangeText={handleBodyWeightChange}
            keyboardType="numeric"
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            Goal Weight (lbs):
          </Text>
          <TextInput
            style={{
              height: 40,
              width: 150,
              borderColor: 'gray',
              borderWidth: 1,
            }}
            value={goalWeight}
            onChangeText={handleGoalWeightChange}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            Food:
          </Text>
          <TextInput
            style={{
              height: 40,
              width: 150,
              borderColor: 'gray',
              borderWidth: 1,
            }}
            value={food}
            onChangeText={handleFoodChange}
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            Calories:
          </Text>
          <TextInput
            style={{
              height: 40,
              width: 150,
              borderColor: 'gray',
              borderWidth: 1,
            }}
            value={calories}
            onChangeText={handleCaloriesChange}
            keyboardType="numeric"
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            Protein (g):
          </Text>
          <TextInput
            style={{
              height: 40,
              width: 150,
              borderColor: 'gray',
              borderWidth: 1,
            }}
            value={protein}
            onChangeText={handleProteinChange}
            keyboardType="numeric"
          />
        </View>
      </View>

      <Button
        title="Add Calories & Protein"
        onPress={handleAddCalories}
        style={{
          alignSelf: 'center',
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 10,
        }}
      >
        <Text>Total Calories: {totalCalories}</Text>
        <Button
          title="Clear Calories"
          onPress={handleClearCalories}
          style={{
            alignSelf: 'center',
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
        }}
      >
        <Text>Total Protein: {totalProtein}g</Text>
        <View
          style={{
            marginLeft: 20,
          }}
        >
          <Button
            title="Clear Protein"
            onPress={handleClearProtein}
            style={{
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
            }}
          >
            Suggested Protein (g): {suggestedProtein}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CalorieTracker;
