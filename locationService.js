// locationService.js
import * as Location from 'expo-location';
import { SHARE_SERVICEPROVIDER_LOCATION } from './backgroundLocationTask';

export const startBackgroundLocation = async () => {
  const fg = await Location.requestForegroundPermissionsAsync();
  const bg = await Location.requestBackgroundPermissionsAsync();
  if (fg.status !== 'granted' || bg.status !== 'granted') return;

  const alreadyRunning = await Location.hasStartedLocationUpdatesAsync(SHARE_SERVICEPROVIDER_LOCATION);
  if (!alreadyRunning) {
    await Location.startLocationUpdatesAsync(SHARE_SERVICEPROVIDER_LOCATION, {
      accuracy: Location.Accuracy.High,
      timeInterval: 180000,
      distanceInterval: 0,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Skill Link Sharing Location',
        notificationBody: 'Sharing location in background to receive nearby requests',
        notificationColor: '#0000FF',
        
      },
    });
  }
};

export const stopBackgroundLocation = async () => {
  const running = await Location.hasStartedLocationUpdatesAsync(SHARE_SERVICEPROVIDER_LOCATION);
  if (running) {
    await Location.stopLocationUpdatesAsync(SHARE_SERVICEPROVIDER_LOCATION);
  }
};
