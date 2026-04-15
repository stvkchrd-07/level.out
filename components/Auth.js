import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase'; // Adjust path if your supabase.js is elsewhere

export default function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // The Trick: We convert their simple username into a dummy email for Supabase
  const formatEmail = (user) => `${user.trim().toLowerCase()}@level.out`;

  async function signInWithUsername() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: formatEmail(username),
      password: password,
    });

    if (error) Alert.alert('Login Failed', error.message);
    setLoading(false);
  }

  async function signUpWithUsername() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formatEmail(username),
      password: password,
      options: {
        data: {
          username: username.trim().toLowerCase(), // This gets sent to the SQL trigger we made
        },
      },
    });

    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else {
      Alert.alert('Welcome!', 'Your account has been created.');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Welcome back." : "Claim your name."}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUsername(text.replace(/\s/g, ''))} // Prevent spaces
          value={username}
          placeholder="username"
          placeholderTextColor="#A1A1AA"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="password"
          placeholderTextColor="#A1A1AA"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={isLogin ? signInWithUsername : signUpWithUsername}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>{isLogin ? "Sign In" : "Create Account"}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
        <Text style={styles.toggleText}>
          {isLogin ? "Need an account? " : "Already have one? "}
          <Text style={styles.toggleHighlight}>{isLogin ? "Sign up" : "Log in"}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    marginBottom: 48,
    color: '#111',
  },
  inputContainer: {
    marginBottom: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  input: {
    fontSize: 20,
    fontWeight: '300',
    paddingVertical: 12,
    color: '#111',
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 20,
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
  toggleButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    color: '#6B7280',
    fontSize: 14,
  },
  toggleHighlight: {
    color: '#111',
    fontWeight: '500',
  },
});