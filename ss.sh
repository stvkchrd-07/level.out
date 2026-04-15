# Force-update Auth.js with bulletproof validation
cat << 'EOF' > components/Auth.js
import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const formatEmail = (user) => `${user.trim().toLowerCase()}@level.out`;

  async function signInWithUsername() {
    if (!username || !password) {
      Alert.alert('Hold up', 'Please enter both a username and password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: formatEmail(username),
      password: password,
    });

    if (error) Alert.alert('Login Failed', error.message);
    setLoading(false);
  }

  async function signUpWithUsername() {
    if (!username || !password) {
      Alert.alert('Hold up', 'Please enter both a username and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formatEmail(username),
      password: password,
      options: {
        data: {
          username: username.trim().toLowerCase(),
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
          onChangeText={(text) => setUsername(text.replace(/\s/g, ''))}
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
EOF

echo "✅ Auth.js completely updated with safety checks!"