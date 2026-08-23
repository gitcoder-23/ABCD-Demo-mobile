import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../app/redux/hooks';
import { ForgotPasswordAction } from '../../app/redux/actions/authAction';
import { authStyles as styles } from './styles';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();
  const { isForgotPasswordLoading, forgotPasswordError } = useAppSelector(state => state.authApp);

  const handleForgotPassword = async () => {
    try {
      await dispatch(ForgotPasswordAction({ email })).unwrap();
      Alert.alert('Success', 'Reset instructions sent to your email.');
      navigation.navigate('ResetPassword', { email });
    } catch (err: any) {
      // Error handled by redux
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email to reset your password</Text>
          
          {forgotPasswordError ? <Text style={styles.errorText}>{forgotPasswordError}</Text> : null}

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

          <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={isForgotPasswordLoading}>
            {isForgotPasswordLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
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
