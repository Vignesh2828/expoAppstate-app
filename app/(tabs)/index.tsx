import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useLocation } from '../../useLocation'

export default function App() {
  const { location, errorMsg, permissionDenied, locationPermission, checkLocationStatus } = useLocation();
  return (
    <View style={styles.container}>
      <Text>Location: {location ? JSON.stringify(location) : 'null'}</Text>
      <Text>Error: {errorMsg ? errorMsg : 'null'}</Text>
      <Text>Permission Denied: {permissionDenied }</Text>
      <Text>Location Permission: {locationPermission }</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
