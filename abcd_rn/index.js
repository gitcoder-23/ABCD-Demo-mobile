/**
 * @format
 */

import { ActivityIndicator, AppRegistry } from 'react-native';
import App from './App';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './src/app/redux/store';
import { name as appName } from './app.json';

// AppRegistry.registerComponent(appName, () => App);
const ABCDRN = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </>
  );
};

AppRegistry.registerComponent(appName, () => ABCDRN);
