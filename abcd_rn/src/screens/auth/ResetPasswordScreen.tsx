import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import rootApi from '../../app/api/rootApi';
import { resetPasswordApi } from '../../app/api/config';
import { authStyles as styles } from './styles';

const ResetPasswordScreen = ({ route, navigation }: any) => {
  const email = route.params?.email || '';
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      await rootApi.post(resetPasswordApi, { email, otp, newPassword });
      setMessage('Password reset successful. Please login.');
      setTimeout(() => {
         navigation.navigate('Login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Check your code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter the code sent to {email}</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {message ? <Text style={{color: 'green', marginBottom: 10}}>{message}</Text> : null}

          <View style={styles.formGroup}>
            <TextInput 
              style={styles.input} 
              placeholder="Reset Code / OTP" 
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              placeholderTextColor="#999"
            />
            <TextInput 
              style={styles.input} 
              placeholder="New Password" 
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Reset Password</Text>}
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
