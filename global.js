import 'react-native-get-random-values';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  if (typeof crypto === 'undefined') {
    const crypto = require('crypto');
    window.crypto = crypto.webcrypto;
  }
}