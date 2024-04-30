import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { FontAwesome } from '@expo/vector-icons'; // Assuming you're using Expo for icons

const supabaseUrl = 'https://hkcxvbsjhcdgfjfrutcj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrY3h2YnNqaGNkZ2ZqZnJ1dGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzODY2MTQsImV4cCI6MjAyODk2MjYxNH0.jjY6wmZdD3p2EyzueUDIxGgsb2227Rgzxi82uicBJtI';
const supabase = createClient(supabaseUrl, supabaseKey);

const CalorieTracker = () => {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [foodEntries, setFoodEntries] = useState([]);
  const [calorieFace, setCalorieFace] = useState('😐'); // Default neutral face

  useEffect(() => {
    const fetchFoodEntries = async () => {
      const { data, error } = await supabase.from('food_entries').select('*');
      if (error) {
        console.error('Error fetching food entries:', error);
      } else {
        console.log('Food entries fetched:', data);
        setFoodEntries(data);
      }
    };

    fetchFoodEntries();
  }, []);
  
  useEffect(() => {
    // Update calorie face based on percentage of consumed calories
    const percentage = (totalCalories / suggestedCalories.suggestedCalories) * 100;
    if (percentage < 10) {
      setCalorieFace('😢'); // Sad face
    } else if (percentage >= 10 && percentage <= 70) {
      setCalorieFace('😐'); // Neutral face
    } else {
      setCalorieFace('😊'); // Happy face
    }
  }, [totalCalories]);

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

  const handleAgeChange = (text) => {
    setAge(text);
  };

  const handleSexChange = (text) => {
    setSex(text);
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

  const calculateSuggestedCalories = () => {
    if (bodyWeight && age && sex && goalWeight) {
      const currentBodyWeight = parseFloat(bodyWeight);
      const targetBodyWeight = parseFloat(goalWeight);
      let suggestedCalories = currentBodyWeight * 15; // Default value
      let suggestedProtein = currentBodyWeight; // Default value

      if (targetBodyWeight < currentBodyWeight) {
        suggestedCalories = targetBodyWeight * 15 - 500;
        suggestedProtein *= 0.7;
      }

      const ageInt = parseInt(age);
      if (sex === 'male') {
        if (ageInt >= 19 && ageInt <= 30) {
          suggestedCalories += 400;
          suggestedProtein *= 1.0;
        } else if (ageInt >= 31 && ageInt <= 60) {
          suggestedCalories += 200;
          suggestedProtein *= 1.0;
        }
      } else if (sex === 'female') {
        if (ageInt >= 31 && ageInt <= 60) {
          suggestedCalories -= 200;
          suggestedProtein *= 0.7;
        } else if (ageInt >= 61) {
          suggestedCalories -= 400;
          suggestedProtein *= 0.7;
        }
      }

      if (sex === 'female') {
        suggestedProtein -= 5;
      }

      return { suggestedCalories: Math.round(suggestedCalories), suggestedProtein: Math.round(suggestedProtein) };
    }
    return { suggestedCalories: 0, suggestedProtein: 0 };
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

  const suggestedCalories = calculateSuggestedCalories();
  const suggestedCaloriesPercentage = (totalCalories / suggestedCalories.suggestedCalories) * 100;
  const suggestedProtein = suggestedCalories.suggestedProtein;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: '#add8e6', marginTop: 0, padding: 20 }}>
        <Text
          style={{
            fontFamily: 'Lucida Calligraphy', // Fancy cursive font
            fontSize: 40,
            color: 'white',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Calorie Tracker
        </Text>

        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>Food Entries</Text>
          <FlatList
            data={foodEntries}
            renderItem={({ item }) => (
              <Text style={{ fontSize: 16, color: '#333' }}>{`${item.food}: ${item.calories} calories, ${item.protein}g protein`}</Text>
            )}
          />
          <Button title="Clear Food Entries" onPress={handleClearFoodEntries} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Body Weight (lbs):</Text>
            <TextInput
              style={{ height: 40, width: 150, borderColor: 'gray', borderWidth: 1 }}
              value={bodyWeight}
              onChangeText={handleBodyWeightChange}
              keyboardType="numeric"
              blurOnSubmit={true}
            />
          </View>

          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Goal Weight (lbs):</Text>
            <TextInput
              style={{ height: 40, width: 150, borderColor: 'gray', borderWidth: 1 }}
              value={goalWeight}
              onChangeText={handleGoalWeightChange}
              keyboardType="numeric"
              blurOnSubmit={true}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Age:</Text>
            <TextInput
              style={{ height: 40, width: 150, borderColor: 'gray', borderWidth: 1 }}
              value={age}
              onChangeText={handleAgeChange}
              keyboardType="numeric"
              blurOnSubmit={true}
            />
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Sex:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={{ height: 40, width: 100, borderColor: 'gray', borderWidth: 1 }}
                value={sex}
                onChangeText={handleSexChange}
                blurOnSubmit={true}
              />
              <TouchableOpacity onPress={() => alert("Sex is only used to get a better understanding of what your suggested calories should be. Feel free to opt out of inputting sex if you would like to not use it.")}>
                <FontAwesome name="info-circle" size={24} color="blue" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Food:</Text>
            <TextInput
              style={{ height: 40, width: 150, borderColor: 'gray', borderWidth: 1 }}
              value={food}
              onChangeText={handleFoodChange}
            />
          </View>
          <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Calories:</Text>
            <TextInput
              style={{ height: 40, width: 150, borderColor: 'gray', borderWidth: 1 }}
              value={calories}
              onChangeText={handleCaloriesChange}
              keyboardType="numeric"
              blurOnSubmit={true}
            />
          </View>
        </View>

        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Protein (g):</Text>
          <TextInput
            style={{ height: 40, width: 150, borderColor: 'gray', borderWidth: 1 }}
            value={protein}
            onChangeText={handleProteinChange}
            keyboardType="numeric"
            blurOnSubmit={true}
          />
        </View>

        <Button title="Add Calories & Protein" onPress={handleAddCalories} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
          <Text style={{ color: '#333' }}>Total Calories: {totalCalories}</Text>
          <Button title="Clear Calories" onPress={handleClearCalories} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Total Protein: {totalProtein}g</Text>
          <View style={{ marginLeft: 20 }}>
            <Button title="Clear Protein" onPress={handleClearProtein} />
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Suggested Calories: {suggestedCalories.suggestedCalories}</Text>
            <View style={{ width: '100%', height: 20, backgroundColor: 'lightgray', borderRadius: 5, marginTop: 5 }}>
              <View style={{ width: `${suggestedCaloriesPercentage}%`, height: '100%', backgroundColor: 'purple', borderRadius: 5 }} />
            </View>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Suggested Protein: {suggestedProtein}g</Text>
            <Text style={{ fontSize: 100 }}>{calorieFace}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CalorieTracker;