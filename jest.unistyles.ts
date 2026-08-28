// side-effect require on purpose — an ESM import would pull
// react-native-unistyles' raw .ts sources into tsc's program (3 upstream errors)
require('react-native-unistyles/mocks');
