import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, TouchableWithoutFeedback, Keyboard, ScrollView, SafeAreaView } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import * as Application from 'expo-application';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import ProteinPieChart from './ProteinPieChart';

const supabaseUrl = 'https://hkcxvbsjhcdgfjfrutcj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrY3h2YnNqaGNkZ2ZqZnJ1dGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzODY2MTQsImV4cCI6MjAyODk2MjYxNH0.jjY6wmZdD3p2EyzueUDIxGgsb2227Rgzxi82uicBJtI';
const supabase = createClient(supabaseUrl, supabaseKey);

const MainScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [deviceId, setDeviceId] = useState('');
  const [profile, setProfile] = useState(null);
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [foodEntries, setFoodEntries] = useState([]);
  const [calorieFace, setCalorieFace] = useState('😐');
  const [errorMessage, setErrorMessage] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [showCustomInputs, setShowCustomInputs] = useState(false);
  const updateTotals = useCallback(() => {
    let newTotalCalories = 0;
    let newTotalProtein = 0;
    foodEntries.forEach(entry => {
      newTotalCalories += entry.calories;
      newTotalProtein += entry.protein;
    });
    setTotalCalories(newTotalCalories);
    setTotalProtein(newTotalProtein);
  }, [foodEntries]);

  useEffect(() => {
    updateTotals();
  }, [updateTotals]);

  useEffect(() => {
    const fetchDeviceId = async () => {
      const iosId = await Application.getIosIdForVendorAsync();
      setDeviceId(iosId);
    };

    fetchDeviceId();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (deviceId) {
        try {
          const { data, error } = await supabase
            .from('profiles1')
            .select('*')
            .eq('device_id', deviceId)
            .order('id', { ascending: false })
            .limit(1)
            .single();

          if (error) {
            console.error('Error fetching profile data:', error.message);
          } else {
            setProfile(data);
          }
        } catch (error) {
          console.error('Unexpected error fetching profile data:', error.message);
        }
      }
    };
    if (deviceId && isFocused) {
      fetchProfileData();
    }
  }, [deviceId, isFocused]);

  useEffect(() => {
    const fetchFoodEntries = async () => {
      if (deviceId) {
        try {
          const { data, error } = await supabase
            .from('food_entries')
            .select('*')
            .eq('device_id', deviceId)
            .order('created_at', { ascending: false });

          if (error) {
            setErrorMessage('Error fetching food entries: ' + error.message);
          } else {
            setFoodEntries(data);
          }
        } catch (error) {
          setErrorMessage('Unexpected error fetching food entries: ' + error.message);
        }
      }
    };

    fetchFoodEntries();
  }, [deviceId]);

  useEffect(() => {
    const fetchTotalCaloriesAndProtein = async () => {
      if (deviceId) {
        try {
          const { data, error } = await supabase
            .from('food_entries')
            .select('calories, protein')
            .eq('device_id', deviceId);
  
          if (error) {
            setErrorMessage('Error fetching food entries: ' + error.message);
          } else {
            let totalCalories = 0;
            let totalProtein = 0;
  
            data.forEach(entry => {
              totalCalories += entry.calories;
              totalProtein += entry.protein;
            });
  
            setTotalCalories(totalCalories);
            setTotalProtein(totalProtein);
          }
        } catch (error) {
          setErrorMessage('Unexpected error fetching food entries: ' + error.message);
        }
      }
    };
  
    fetchTotalCaloriesAndProtein();
  }, [deviceId, foodEntries]);
  useEffect(() => {
    const percentage = (totalCalories / calculateSuggestedCalories().suggestedCalories) * 100;
    if (percentage < 10) {
      setCalorieFace('😢');
    } else if (percentage >= 10 && percentage <= 70) {
      setCalorieFace('😐');
    } else {
      setCalorieFace('😊');
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

  const handleClearCalories = () => {
    setTotalCalories(0);
  };

  const handleClearProtein = () => {
    setTotalProtein(0);
  };

  const handleClearFoodEntries = async () => {
    try {
      const { error: deleteError } = await supabase
        .from('food_entries')
        .delete()
        .eq('device_id', deviceId);

      if (deleteError) {
        throw new Error('Error deleting food entries: ' + deleteError.message);
      }

      setFoodEntries([]);
      updateTotals();
      console.log('All food entries cleared successfully');
    } catch (error) {
      setErrorMessage('Unexpected error clearing food entries: ' + error.message);
    }
  };

  const calculateSuggestedCalories = useCallback(() => {
    if (!profile) return { 
      suggestedCalories: 0, 
      suggestedProtein: 0, 
      isCustomCalories: false, 
      isCustomProtein: false 
    };
  
    const { sex, age, body_weight, goal_weight } = profile;
    const currentBodyWeight = parseFloat(body_weight || '0');
    const targetBodyWeight = parseFloat(goal_weight || '0');
    let suggestedCalories = 0;
    let suggestedProtein = 0;
    let isCustomCalories = false;
    let isCustomProtein = false;
  
    if (customCalories) {
      suggestedCalories = parseInt(customCalories);
      isCustomCalories = true;
    } else if (currentBodyWeight && targetBodyWeight && age && sex) {
      suggestedCalories = currentBodyWeight * 15 +300;
  
      if (targetBodyWeight < currentBodyWeight) {
        suggestedCalories = currentBodyWeight * 15 - 500;
      }
      if (targetBodyWeight === currentBodyWeight) {
        suggestedCalories = targetBodyWeight * 15 ;
      }
  
      const ageInt = parseInt(age);
      if (sex === 'male') {
        if (ageInt >= 19 && ageInt <= 30) {
          suggestedCalories += 400;
        } else if (ageInt >= 31 && ageInt <= 60) {
          suggestedCalories += 200;
        }
      } else if (sex === 'female') {
        if (ageInt >= 31 && ageInt <= 60) {
          suggestedCalories -= 200;
        } else if (ageInt >= 61) {
          suggestedCalories -= 400;
        }
      }
  
      if (sex === 'female' && suggestedCalories < 1800) {
        suggestedCalories = 1800;
      } else if (sex === 'male' && suggestedCalories < 2000) {
        suggestedCalories = 2000;
      }
    }
  
    if (customProtein) {
      suggestedProtein = parseFloat(customProtein);
      isCustomProtein = true;
    } else if (currentBodyWeight && age && sex) {
      suggestedProtein = currentBodyWeight;
  
      if (targetBodyWeight < currentBodyWeight) {
        suggestedProtein *= 0.7;
      }
  
      const ageInt = parseInt(age);
      if (sex === 'male') {
        if (ageInt >= 19 && ageInt <= 30) {
          suggestedProtein *= 1.0;
        } else if (ageInt >= 31 && ageInt <= 60) {
          suggestedProtein *= 1.0;
        }
      } else if (sex === 'female') {
        if (ageInt >= 31 && ageInt <= 60) {
          suggestedProtein *= 0.7;
        } else if (ageInt >= 61) {
          suggestedProtein *= 0.7;
        }
      }
  
      if (sex === 'female') {
        suggestedProtein -= 5;
      }
    }
  
    return { 
      suggestedCalories: Math.round(suggestedCalories), 
      suggestedProtein: Math.round(suggestedProtein),
      isCustomCalories,
      isCustomProtein
    };
  }, [profile, customCalories, customProtein]);

  const handleAddCalories = async () => {
    const enteredCalories = parseInt(calories, 10);
    const enteredProtein = parseInt(protein, 10);
    if (!isNaN(enteredCalories) && !isNaN(enteredProtein) && food.trim() !== '') {
      const newEntry = { food_name: food.trim(), calories: enteredCalories, protein: enteredProtein, device_id: deviceId };
      
      try {
        const { data, error } = await supabase
          .from('food_entries')
          .insert(newEntry)
          .select();
        
        if (error) {
          setErrorMessage('Error inserting food entry: ' + error.message);
        } else {
          console.log('New food entry inserted successfully');
          setFoodEntries(prevEntries => [...prevEntries, data[0]]);
          updateTotals();
        }
      } catch (error) {
        setErrorMessage('Unexpected error inserting food entry: ' + error.message);
      }

      setFood('');
      setCalories('');
      setProtein('');
    }
  };

  const fetchNutritionData = async (foodName) => {
    try {
      const apiKey = 'R+iBH3ZstspvdxGL+yw+2Q==ekOqNyfQ1OzSye94';
      const response = await axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${foodName}`, {
        headers: {
          'X-Api-Key': apiKey,
        },
      });
  
      const responseData = JSON.stringify(response.data);
      console.log(responseData);
  
      const caloriesIndex = responseData.indexOf('"calories":');
      const proteinIndex = responseData.indexOf('"protein_g":');
  
      if (caloriesIndex !== -1 && proteinIndex !== -1) {
        const calories = parseFloat(responseData.substring(caloriesIndex + 11, responseData.indexOf(',', caloriesIndex)));
        const protein = parseFloat(responseData.substring(proteinIndex + 12, responseData.indexOf(',', proteinIndex)));
  
        setCalories(calories.toFixed(2).toString());
        setProtein(protein.toFixed(2).toString());
      } else {
        console.log('No nutrition data found for the given food item.');
      }
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
    }
  };
  const CustomButton = ({ title, onPress, style }) => (
    <TouchableOpacity 
      style={{ 
        backgroundColor: 'white', 
        padding: 10, 
        borderRadius: 5, 
        marginVertical: 5, 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: 'black',
        ...style 
      }} 
      onPress={onPress}
    >
      <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
    </TouchableOpacity>
  );

  

  const proteinPercentage = suggestedProtein > 0 ? (totalProtein / suggestedProtein) * 100 : 0;
  

  const suggestedCalories = calculateSuggestedCalories();
  const suggestedCaloriesPercentage = (totalCalories / suggestedCalories.suggestedCalories) * 100;
  const suggestedProtein = suggestedCalories.suggestedProtein;
  const suggestedProteinPercentage = (totalProtein / suggestedCalories.suggestedProtein) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#add8e6' }}>
      <FlatList
        data={foodEntries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 16, color: '#333', padding: 5 }}>{`${item.food_name}: ${item.calories} calories, ${item.protein}g protein`}</Text>
        )}
        ListHeaderComponent={
          <View>
            <Text style={{ fontFamily: 'cursive', fontSize: 40, color: 'white', marginBottom: 20, textAlign: 'center' }}>
              Calorie Tracker
            </Text>
            {errorMessage ? <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text> : null}
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' }}>Food Entries</Text>
          </View>
        }
        ListFooterComponent={
          <View>
            <CustomButton 
              title="Clear Food Entries" 
              onPress={handleClearFoodEntries} 
              style={{ marginTop: 10, marginBottom: 20 }}
            />
  
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Add Food</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Food:</Text>
                  <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 5 }}
                    value={food}
                    onChangeText={handleFoodChange}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Calories:</Text>
                  <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 5 }}
                    value={calories}
                    onChangeText={handleCaloriesChange}
                    keyboardType="numeric"
                    blurOnSubmit={true}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Protein (g):</Text>
                  <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 5 }}
                    value={protein}
                    onChangeText={handleProteinChange}
                    keyboardType="numeric"
                    blurOnSubmit={true}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <CustomButton title="Get Nutrition" onPress={() => fetchNutritionData(food)} />
                </View>
              </View>
              <CustomButton title="Add Calories & Protein" onPress={handleAddCalories} />
            </View>
  
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
              <View style={{ alignItems: 'center', borderWidth: 2, borderColor: 'pink', padding: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>Total Calories</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'maroon' }}>{totalCalories}</Text>
                <CustomButton title="Clear Calories" onPress={handleClearCalories} />
              </View>
              <View style={{ alignItems: 'center', borderWidth: 2, borderColor: 'pink', padding: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>Total Protein</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F79E4F' }}>{totalProtein}g</Text>
                <CustomButton title="Clear Protein" onPress={handleClearProtein} />
              </View>
            </View>
  
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Suggested Calories: {suggestedCalories.suggestedCalories}</Text>
              <View style={{ width: '100%', height: 20, backgroundColor: 'lightgray', borderRadius: 5, marginTop: 5, marginBottom: 15 }}>
                <View style={{ width: `${suggestedCaloriesPercentage}%`, height: '100%', backgroundColor: 'purple', borderRadius: 5 }} />
              </View>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>Suggested Protein: {suggestedProtein}g</Text>
              <View style={{ width: '100%', height: 20, backgroundColor: 'lightgray', borderRadius: 5, marginTop: 5, marginBottom: 15 }}>
                <View style={{ width: `${suggestedProteinPercentage}%`, height: '100%', backgroundColor: '#F79E4F', borderRadius: 5 }} />
              </View>
            </View>
  
            <CustomButton title="Go to Profile" onPress={() => navigation.navigate('Profile')} style={{ marginTop: 20 }} />
          </View>
        }
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
};
export default MainScreen;
