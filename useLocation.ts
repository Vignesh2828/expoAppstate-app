import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { AppState, AppStateStatus } from 'react-native';

type LocationType = {
  latitude: number;
  longitude: number;
};

type UseLocationReturnType = {
  location: LocationType | null;
  errorMsg: string | null;
  permissionDenied: boolean;
  locationPermission: boolean;
  checkLocationStatus: () => void;
};

export const useLocation = (): UseLocationReturnType => {
  const appState = useRef(AppState.currentState);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  const checkLocationStatus = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!permissionDenied) {
          setPermissionDenied(true);
          setErrorMsg('Permission to access location was denied. Please enable location permissions.');
        }
        return;
      }

      setPermissionDenied(false);

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setLocationPermission(true);
        setErrorMsg('Location services are disabled. Please enable location services.');
        return;
      }

      setLocationPermission(false);

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch (error) {
      setErrorMsg(`Error while fetching location: ${(error as Error).message}`);
    }
  };

  useEffect(() => {
    // Initial check
      checkLocationStatus();

       // Handle app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (appState.current.match(/background|inactive/) && nextAppState === 'active') {
          alert('App has come to the foreground!');
          checkLocationStatus();
        }
        appState.current = nextAppState;
    };
    

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    location,
    errorMsg,
    locationPermission,
    permissionDenied,
    checkLocationStatus,
  };
};
