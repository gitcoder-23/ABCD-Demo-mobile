import React, { useEffect } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootState } from './src/app/redux/store';
import { setSessionFromNative } from './src/app/redux/slices/authAppSlice';

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

interface AppProps {
  initialProps?: {
    accessToken?: string;
    refreshToken?: string;
    userData?: string | any;
    targetScreen?: string;
  };
}

const NavigationWrapper = ({ initialProps }: AppProps) => {
  const navigationRef = useNavigationContainerRef();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.authApp);

  const applyAuthData = (data: any) => {
    if (data?.accessToken) {
      let parsedUser = null;
      if (typeof data.userData === 'string' && data.userData) {
        try {
          parsedUser = JSON.parse(data.userData);
        } catch (e) {
          parsedUser = null;
        }
      } else if (typeof data.userData === 'object') {
        parsedUser = data.userData;
      }

      dispatch(
        setSessionFromNative({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || '',
          userData: parsedUser,
        }),
      );

      const target = data.targetScreen || 'TestCatalog';
      setTimeout(() => {
        if (navigationRef.isReady()) {
          try {
            navigationRef.navigate(target as never);
          } catch (err) {
            console.log('Navigation navigate error:', err);
          }
        }
      }, 300);
    }
  };

  useEffect(() => {
    // 1. Process initial props from Android Intent
    if (initialProps?.accessToken) {
      applyAuthData(initialProps);
    } else if (NativeModules.NativeBridge?.getAuthData) {
      // 2. Query NativeBridge
      NativeModules.NativeBridge.getAuthData()
        .then((authData: any) => {
          if (authData?.accessToken) {
            applyAuthData(authData);
          }
        })
        .catch((e: any) => console.log('NativeBridge error', e));
    }

    // 3. Listen for runtime auth updates
    if (NativeModules.NativeBridge) {
      const eventEmitter = new NativeEventEmitter(NativeModules.NativeBridge);
      const sub = eventEmitter.addListener('onAuthDataReceived', data => {
        applyAuthData(data);
      });
      return () => sub.remove();
    }
  }, [initialProps]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8F9FA' } }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="TestCatalog" component={TestCatalogScreen} options={{ title: 'All Tests' }} />
        <Stack.Screen name="TestDetail" component={TestDetailScreen} options={{ title: 'Test Detail' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About Us' }} />
        <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us' }} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyOtp"
          component={VerifyOtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function App(props: any): React.JSX.Element {
  return <NavigationWrapper initialProps={props?.initialProps || props} />;
}

export default App;
