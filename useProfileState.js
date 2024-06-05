import { useState } from 'react';

const useProfileState = () => {
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');

  return {
    sex,
    age,
    bodyWeight,
    goalWeight,
    setSex,
    setAge,
    setBodyWeight,
    setGoalWeight,
  };
};

export default useProfileState;