import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import rootApi from '../../app/api/rootApi';
import { verifyRegisterApi, resendRegisterOtpApi } from '../../app/api/config';
import { authStyles as styles } from './styles';

const VerifyOtpScreen = ({ route, navigation }: any) => {
  const email = route.params?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      await rootApi.post(verifyRegisterApi, { email, otp });
      // Successfully verified, navigate to login
      navigation.navigate('Login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      await rootApi.post(resendRegisterOtpApi, { email });
      setMessage('OTP has been resent to your email.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {message ? <Text style={{color: 'green', marginBottom: 10}}>{message}</Text> : null}

          <View style={styles.formGroup}>
            <TextInput 
              style={styles.input} 
              placeholder="Enter OTP" 
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.linkButton, {marginTop: 10}]} 
            onPress={handleResend}
            disabled={loading}
          >
            <Text style={styles.linkText}>Resend OTP</Text>
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

export default VerifyOtpScreen;
