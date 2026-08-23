import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../app/redux/hooks';
import { VerifyRegisterAction, ResendRegisterOtpAction } from '../../app/redux/actions/authAction';
import { authStyles as styles } from './styles';

const VerifyOtpScreen = ({ route, navigation }: any) => {
  const email = route.params?.email || '';
  const [otp, setOtp] = useState('');
  const dispatch = useAppDispatch();
  const { isVerifyLoading, verifyError, isResendOtpLoading } = useAppSelector(state => state.authApp);

  const handleVerify = async () => {
    try {
      await dispatch(VerifyRegisterAction({ email, code: otp })).unwrap();
      // Navigation to Home handled automatically by App navigator checking accessToken
    } catch (err: any) {
      // Error is handled by Redux state
    }
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(ResendRegisterOtpAction({ email })).unwrap();
      Alert.alert('Success', 'A new OTP has been sent to your email.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>
          
          {verifyError ? <Text style={styles.errorText}>{verifyError}</Text> : null}

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

          <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={isVerifyLoading}>
            {isVerifyLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verify</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.linkButton, { marginTop: 16 }]} 
            onPress={handleResendOtp} 
            disabled={isResendOtpLoading}
          >
            {isResendOtpLoading ? (
              <ActivityIndicator color="#000" /> 
            ) : (
              <Text style={styles.linkText}>Resend OTP</Text>
            )}
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
