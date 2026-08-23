import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../app/redux/hooks';
import { RegisterAction } from '../../app/redux/actions/authAction';
import { authStyles as styles } from './styles';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { isRegisterLoading, registerError } = useAppSelector(state => state.authApp);

  const handleRegister = async () => {
    try {
      await dispatch(RegisterAction({ name, email, password })).unwrap();
      navigation.navigate('VerifyOtp', { email });
    } catch (err: any) {
      // Error is also handled by Redux state
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
          
          {registerError ? <Text style={styles.errorText}>{registerError}</Text> : null}

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

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isRegisterLoading}>
            {isRegisterLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Register</Text>}
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
