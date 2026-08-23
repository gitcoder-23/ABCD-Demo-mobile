import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import rootApi from '../../app/api/rootApi';
import { forgotPasswordApi } from '../../app/api/config';
import { authStyles as styles } from './styles';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      await rootApi.post(forgotPasswordApi, { email });
      // Navigate to Reset Password and pass email
      navigation.navigate('ResetPassword', { email });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email to receive a reset code</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {message ? <Text style={{color: 'green', marginBottom: 10}}>{message}</Text> : null}

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
          </View>

          <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Send Code</Text>}
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
