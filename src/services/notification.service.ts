import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../config/firebase';
import apiClient from './apiClient';
import { useToast } from 'vue-toastification';

const VAPID_KEY = 'BFUxGl5lgDKrdGlsCNwKTpW3jjvTsy5I3up_XaBixFb3KB8ZVBTKbKNaBav80gZ-nZLGRyH365sgVFqr-ok4Ab4'; 

export const notificationService = {

  async requestPermission() {
    console.log('Requesting permission...');
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      await this.getAndSaveToken();
    } else {
      console.error('Unable to get permission to notify.');
    }
  },

  async getAndSaveToken() {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: VAPID_KEY !== 'YOUR_PUBLIC_VAPID_KEY_HERE' ? VAPID_KEY : undefined,
      });

      if (currentToken) {
        console.log('FCM Token:', currentToken);
        await this.sendTokenToBackend(currentToken);
      } else {
        console.warn('No registration token available. Request permission to generate one.');
      }
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
    }
  },

  async sendTokenToBackend(token: string) {
    try {
      const endpoint = import.meta.env.VITE_FCM_TOKEN_ENDPOINT || '/fcm/token';
      const response = await apiClient.post(endpoint, { token });
      console.log('Token sent to backend successfully:', response.data);
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  },

  initPushNotifications() {
    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      
      if (payload.notification) {
        const toast = useToast();
        const { title, body } = payload.notification;
        toast.info(`${title}: ${body}`, {
          timeout: 7000,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    });



    // Check if permission is already granted
    if (Notification.permission === 'granted') {
      this.getAndSaveToken();
    } else if (Notification.permission !== 'denied') {
      this.requestPermission();
    }
  }
};

export default notificationService;
