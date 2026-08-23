import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootState } from './src/app/redux/store';

// App Screens
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';
import ContactScreen from './src/screens/ContactScreen';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import VerifyOtpScreen from './src/screens/auth/VerifyOtpScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/auth/ResetPasswordScreen';

// Test Screens
import TestCatalogScreen from './src/screens/test/TestCatalogScreen';
import TestDetailScreen from './src/screens/test/TestDetailScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#B71234' },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: 'bold' as const },
  contentStyle: { backgroundColor: '#F8F9FA' },
};

const NavigationWrapper = () => {
  const { accessToken } = useSelector((state: RootState) => state.authApp);
  const isAuthenticated = !!accessToken;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={screenOptions}>
        {/* Splash screen is shown initially */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {isAuthenticated ? (
          // App Stack
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
            <Stack.Screen name="TestCatalog" component={TestCatalogScreen} />
            <Stack.Screen name="TestDetail" component={TestDetailScreen} />
          </Stack.Group>
        ) : (
          // Auth Stack
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function App(): React.JSX.Element {
  return <NavigationWrapper />;
}

export default App;
