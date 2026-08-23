import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../app/redux/hooks';
import { ResetPasswordAction } from '../../app/redux/actions/authAction';
import { authStyles as styles } from './styles';

const ResetPasswordScreen = ({ route, navigation }: any) => {
  const { email } = route.params || { email: '' };
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useAppDispatch();
  const { isResetPasswordLoading, resetPasswordError } = useAppSelector(state => state.authApp);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    try {
      await dispatch(ResetPasswordAction({ email, code: otp, newPassword })).unwrap();
      Alert.alert('Success', 'Password reset successfully.');
      navigation.navigate('Login');
    } catch (err: any) {
      // Handled by Redux
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter the code sent to your email and your new password</Text>
          
          {resetPasswordError ? <Text style={styles.errorText}>{resetPasswordError}</Text> : null}

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
            <TextInput 
              style={styles.input} 
              placeholder="Confirm Password" 
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={isResetPasswordLoading}>
            {isResetPasswordLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Reset Password</Text>}
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
