import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../app/redux/store';

const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = new Animated.Value(0);
  const { accessToken } = useSelector((state: RootState) => state.authApp);

  useEffect(() => {
    if (accessToken) {
      navigation.replace('TestCatalog');
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (accessToken) {
        navigation.replace('TestCatalog');
      } else {
        navigation.replace('Login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation, accessToken]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Text style={styles.title}>Aditya Birla</Text>
        <Text style={styles.subtitle}>Demo Application</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B71234',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#F5A623',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

export default SplashScreen;
