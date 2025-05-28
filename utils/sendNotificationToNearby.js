import { Query } from "react-native-appwrite";
import { database } from "../AppWrite";
import { useEffect, useState } from "react";
import { DATABASE_ID, COLLECTION_IDs } from "../AppWrite";



export default function sendNotificationToNearby(latitude, longitude,requestData) {




getAllServiceProvidersLocation();
function findNearestProviders(Providers) {
    console.log("Providers: ", Providers.length);
    const nearbyProviders = Providers.filter(provider => {
        const distance = getDistanceFromLatLonInKm(latitude, longitude, provider.latitude, provider.longitude);
        provider.distance = distance; // Add distance to provider object for debugging
        return distance <= provider.available_distance; // 5 km radius
    });
    console.log("Nearby Providers: ", nearbyProviders.length);
    sendPushNotification(nearbyProviders);
}

async function sendPushNotification(nearbyProviders) {
    const messages = nearbyProviders.map(provider => {
        return {
            to: provider.push_token,
            title: requestData.request_title+",Service Seeker is "+provider.distance+" km away",
            body: requestData.request_description,
            data: { type:"service_request",requestId: requestData.request_id },
            
        };
    });
    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      }).then((response) => {
        console.log("Push notification sent successfully: ", response);
      } )
    }

function getBoundingBox(lat, lon, distanceKm) {
  const earthRadius = 6371; // in km

  const deltaLat = distanceKm / earthRadius;
  const deltaLon = distanceKm / (earthRadius * Math.cos((Math.PI * lat) / 180));

  const minLat = lat - (deltaLat * 180) / Math.PI;
  const maxLat = lat + (deltaLat * 180) / Math.PI;
  const minLon = lon - (deltaLon * 180) / Math.PI;
  const maxLon = lon + (deltaLon * 180) / Math.PI;

  return {
    minLat,
    maxLat,
    minLon,
    maxLon,
  };
}

async function getAllServiceProvidersLocation() {
console.log("Fetching all service providers location...");
let boundingBox = getBoundingBox(latitude, longitude, 20); // 20 km radius
    await database.listDocuments(DATABASE_ID, COLLECTION_IDs.users, [Query.equal('role', "service_provider"),Query.equal('service_type',requestData.service_type),Query.equal('isavailable',true)],
    Query.between("latitude",boundingBox.minLat,boundingBox.maxLat),Query.between("longitude",boundingBox.minLon,boundingBox.maxLat) ).then((response) => {
        
        
        findNearestProviders(response.documents);
  
      }).catch((error) => {
        console.error('Error fetching user data:', error);
      }
      );
}

    // Helper to calculate distance between two geo points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  
}