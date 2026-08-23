import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useAppDispatch, useAppSelector } from './app/redux/hooks';
import { setLogout, updateTokens } from './app/redux/slices/authAppSlice';
import { setSessionExpiredCallback } from './app/api/rootApi';
import { RefreshTokenAction } from './app/redux/actions/authAction';

const SessionHandler = ({ children }: { children: React.ReactNode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { accessToken, refreshToken } = useAppSelector(state => state.authApp);

  console.log('refreshToken==>', refreshToken);
  console.log('accessToken==>', accessToken);

  const dispatch = useAppDispatch();
  const appState = useRef(AppState.currentState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshTokenRef = useRef(refreshToken);

  useEffect(() => {
    refreshTokenRef.current = refreshToken;
  }, [refreshToken]);

  // Function to refresh token
  const triggerRefresh = () => {
    const currentRefreshToken = refreshTokenRef.current;
    if (currentRefreshToken) {
      console.log('Auto-refreshing tokens...');
      dispatch(RefreshTokenAction({ refreshToken: currentRefreshToken }));
    }
  };

  useEffect(() => {
    setSessionExpiredCallback(() => {
      if (accessToken) {
        setIsModalVisible(true);
      }
    });

    return () => {
      setSessionExpiredCallback(() => {});
    };
  }, [accessToken]);

  useEffect(() => {
    // Start timer if user is logged in
    if (accessToken) {
      timerRef.current = setInterval(triggerRefresh, 480000); // 8 minutes
    }

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      subscription.remove();
    };
  }, [accessToken]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      console.log('App has come to the foreground!');
      // Check if session is still valid or trigger an immediate refresh
      triggerRefresh();
    }
    appState.current = nextAppState;
  };

  const handleLogout = async () => {
    setIsModalVisible(false);
    dispatch(setLogout());
    dispatch(updateTokens({ accessToken: '', refreshToken: '' }));
  };

  return (
    <View style={{ flex: 1 }}>
      {children}

      <Modal transparent visible={isModalVisible} animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Session Expired</Text>
            <Text style={styles.message}>
              Your session has timed out. Please login again to continue.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#B71234',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 25,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#B71234',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SessionHandler;
