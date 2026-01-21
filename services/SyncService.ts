
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = '@sync_queue';

export interface SyncItem {
  id: string;
  url: string;
  method: string;
  body: any;
  timestamp: number;
}

class SyncService {
  private isProcessing = false;

  async init() {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.processQueue();
      }
    });
    // Check on init
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      this.processQueue();
    }
  }

  async fetchWithSync(url: string, options: any) {
    const state = await NetInfo.fetch();
    
    if (state.isConnected) {
      try {
        const response = await fetch(url, options);
        if (response.ok) return response;
        // If it's a server error, maybe we still want to queue it? 
        // For now, only queue if offline
      } catch (err) {
        console.log('SyncService: Network error, queuing for later...');
      }
    }

    // Offline or fetch failed due to network
    if (options.method === 'POST' || options.method === 'PUT') {
      await this.addToQueue(url, options);
      return { ok: true, queued: true }; // Fake success for UI
    }

    throw new Error('Offline and cannot perform request');
  }

  private async addToQueue(url: string, options: any) {
    const queue = await this.getQueue();
    const newItem: SyncItem = {
      id: Math.random().toString(36).substring(7),
      url,
      method: options.method,
      body: options.body,
      timestamp: Date.now(),
    };
    queue.push(newItem);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log('SyncService: Added to queue', newItem.id);
  }

  private async getQueue(): Promise<SyncItem[]> {
    const data = await AsyncStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const queue = await this.getQueue();
      if (queue.length === 0) {
        this.isProcessing = false;
        return;
      }

      console.log(`SyncService: Processing ${queue.length} items...`);
      const remainingItems: SyncItem[] = [];

      for (const item of queue) {
        try {
          const response = await fetch(item.url, {
            method: item.method,
            headers: { 'Content-Type': 'application/json' },
            body: item.body,
          });

          if (!response.ok) {
            remainingItems.push(item);
          } else {
            console.log(`SyncService: Successfully synced ${item.id}`);
          }
        } catch (err) {
          remainingItems.push(item);
        }
      }

      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remainingItems));
    } finally {
      this.isProcessing = false;
    }
  }
}

export default new SyncService();
