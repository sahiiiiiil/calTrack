import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';
import * as Application from 'expo-application';

const supabaseUrl = 'https://hkcxvbsjhcdgfjfrutcj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrY3h2YnNqaGNkZ2ZqZnJ1dGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzODY2MTQsImV4cCI6MjAyODk2MjYxNH0.jjY6wmZdD3p2EyzueUDIxGgsb2227Rgzxi82uicBJtI';
const supabase = createClient(supabaseUrl, supabaseKey);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [sexState, setSex] = useState('');
  const [ageState, setAge] = useState('');
  const [bodyWeightState, setBodyWeight] = useState('');
  const [goalWeightState, setGoalWeight] = useState('');
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const fetchDeviceId = async () => {
      const iosId = await Application.getIosIdForVendorAsync();
      setDeviceId(iosId);
    };

    fetchDeviceId();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
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
          console.log('Profile data fetched:', data);
          if (data) {
            setSex(data.sex);
            setAge(data.age.toString());
            setBodyWeight(data.body_weight.toString());
            setGoalWeight(data.goal_weight.toString());
          }
        }
      } catch (error) {
        console.error('Unexpected error fetching profile data:', error.message);
      }
    };
  
    if (deviceId) {
      fetchProfileData();
    }
  }, [deviceId]);

  const handleSexChange = (text) => {
    setSex(text);
  };

  const handleAgeChange = (text) => {
    setAge(text);
  };

  const handleBodyWeightChange = (text) => {
    setBodyWeight(text);
  };

  const handleGoalWeightChange = (text) => {
    setGoalWeight(text);
  };

  const handleSaveProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles1')
        .insert([
          {
            sex: sexState,
            age: parseInt(ageState, 10),
            body_weight: parseFloat(bodyWeightState),
            goal_weight: parseFloat(goalWeightState),
            device_id: deviceId,
          },
        ]);

      if (error) {
        console.error('Error saving profile data:', error.message);
      } else {
        console.log('Profile data saved successfully:', data);
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Unexpected error saving profile data:', error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Profile</Text>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Sex:</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={sexState}
          onChangeText={handleSexChange}
        />
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Age:</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={ageState}
          onChangeText={handleAgeChange}
          keyboardType="numeric"
        />
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Body Weight (lbs):</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={bodyWeightState}
          onChangeText={handleBodyWeightChange}
          keyboardType="numeric"
        />
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Goal Weight (lbs):</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={goalWeightState}
          onChangeText={handleGoalWeightChange}
          keyboardType="numeric"
        />
      </View>
      <Button title="Save" onPress={handleSaveProfile} />
    </View>
  );
};

export default ProfileScreen; 