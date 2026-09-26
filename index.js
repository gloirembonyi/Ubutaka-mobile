import { registerRootComponent } from 'expo';
import { installAuthFetch } from './services/apiClient';
import App from './App';

// Attach the session token to every Ubutaka API request before any screen loads.
installAuthFetch();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
