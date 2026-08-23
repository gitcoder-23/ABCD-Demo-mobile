import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import rootApi from '../../app/api/rootApi';
import { registerApi } from '../../app/api/config';
import { authStyles as styles } from './styles';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      await rootApi.post(registerApi, { name, email, password });
      navigation.navigate('VerifyOtp', { email });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.formGroup}>
            <TextInput 
              style={styles.input} 
              placeholder="Full Name" 
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Email" 
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Register</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={{color: '#666'}}>Already have an account? <Text style={styles.linkText}>Login</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
