import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../app/redux/slices/authAppSlice';
import rootApi from '../../app/api/rootApi';
import { loginApi } from '../../app/api/config';
import { authStyles as styles } from './styles';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await rootApi.post(loginApi, { email, password });
      
      const { token, refreshToken, user } = response.data;
      dispatch(setCredentials({ token, refreshToken, user }));
      // Navigation will be handled automatically by the App navigator
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.formGroup}>
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

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Login</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={{color: '#666'}}>Don't have an account? <Text style={styles.linkText}>Register</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
