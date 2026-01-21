#!/usr/bin/env node

/**
 * Connection Test Script
 * This script tests if the mobile app can connect to the backend server
 * 
 * Usage: node test-connection.js
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.69:3000/api';

console.log('🔍 Testing connection to backend...\n');
console.log(`📡 API URL: ${API_URL}\n`);

async function testConnection() {
  try {
    console.log('1️⃣ Testing /api/users endpoint...');
    const response = await fetch(`${API_URL}/users`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Connection successful!');
    console.log(`📊 Found ${Array.isArray(data) ? data.length : 0} users\n`);
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error(`Error: ${error.message}\n`);
    
    console.log('🔧 Troubleshooting tips:');
    console.log('  1. Make sure the backend server is running (npm run dev in ubutaka-admin)');
    console.log('  2. Check if the IP address in .env matches your computer\'s IP');
    console.log('  3. Verify both devices are on the same WiFi network');
    console.log('  4. Check Windows Firewall settings for Node.js');
    console.log(`  5. Try accessing ${API_URL}/users in your browser\n`);
    
    return false;
  }
}

// Run the test
testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
