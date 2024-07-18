import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'cursive': require('./assets/fonts/CursiveFont.ttf'), 
  });
};