import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { supabase } from '../api/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Login failed', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert('Signup failed', error.message);
      } else {
        Alert.alert(
          'Success',
          'Account created. Please check your email if confirmation is required.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome 👋</Text>
        <Text style={styles.subtitle}>Login or create an account</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#4F46E5" />
        ) : (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={signIn}>
              <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={signUp}>
              <Text style={styles.secondaryButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#4F46E5',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
