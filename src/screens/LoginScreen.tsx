import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../api/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        Alert.alert('Login failed', error.message);
    }
    };

    const signUp = async () => {
    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        Alert.alert('Signup failed', error.message);
    }
    };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={signIn} />
      <Button title="Sign Up" onPress={signUp} />
    </View>
  );
}
