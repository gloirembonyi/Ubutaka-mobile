
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { User, Screen } from '../types';
import { Colors } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';

interface MediationRoomScreenProps {
  onNavigate: (screen: Screen) => void;
  disputeId: string | null;
  user: User | null;
}

const MediationRoomScreen: React.FC<MediationRoomScreenProps> = ({ onNavigate, disputeId, user }) => {
  const [message, setMessage] = useState('');
  const [showResolution, setShowResolution] = useState(false);
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', type: 'system', text: 'Mediation session started', time: '10:00' },
    { id: '2', type: 'mediator', text: 'Welcome to the mediation room. Let\'s discuss the dispute.', sender: 'Official Mediator', time: '10:01' },
    { id: '3', type: 'system', text: 'All parties are now present.', time: '10:05' },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: message,
      sender: user?.name || 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate auto-reply
    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        type: 'mediator',
        text: 'I am reviewing the documents you provided. Does the other party have anything to add?',
        sender: 'Official Mediator',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const handleFormalize = async () => {
    if (!disputeId) return;
    setLoading(true);
    try {
      const resp = await fetch(API_ENDPOINTS.DISPUTE_BY_ID(disputeId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Resolved',
          description: outcome || 'Resolved through mediation.'
        })
      });
      if (resp.ok) {
        alert("Resolution formalized and synced with LAIS/Blockchain.");
        onNavigate(user?.role === 'ABUNZI' ? 'abunzi-dashboard' : 'dashboard');
      } else {
        alert("Failed to formalize resolution. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => onNavigate(user?.role === 'ABUNZI' ? 'abunzi-dashboard' : 'dispute-detail')} 
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Mediation Room</Text>
        <Pressable 
          onPress={() => setShowResolution(!showResolution)}
          style={styles.formalBtn}
        >
          <MaterialIcons name="gavel" size={20} color={Colors.white} />
        </Pressable>
      </View>

      {showResolution ? (
        <ScrollView style={styles.resolutionPanel}>
          <View style={styles.resCard}>
            <Text style={styles.resTitle}>Formalize Resolution</Text>
            <Text style={styles.resSub}>Record final outcome and upload signed agreement.</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mediation Outcome</Text>
              <TextInput 
                style={styles.textArea}
                multiline
                placeholder="Describe the agreed resolution..."
                value={outcome}
                onChangeText={setOutcome}
              />
            </View>

            <View style={styles.uploadBox}>
              <MaterialIcons name="file-upload" size={32} color={Colors.primary} />
              <Text style={styles.uploadText}>Upload Signed Agreement (PDF/JPEG)</Text>
            </View>

            <Pressable 
              style={[styles.submitRes, loading && { opacity: 0.7 }]} 
              onPress={handleFormalize}
              disabled={loading}
            >
              {loading ? (
                 <ActivityIndicator color={Colors.white} />
              ) : (
                 <Text style={styles.submitResText}>Sign and Sync with LAIS</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.messages} showsVerticalScrollIndicator={false}>
          {messages.map((msg) => (
            <View key={msg.id} style={[
              styles.message, 
              msg.type === 'user' && styles.messageUser,
              msg.type === 'system' && styles.messageSystem
            ]}>
              {msg.type === 'mediator' && <Text style={styles.sender}>{msg.sender}</Text>}
              <Text style={[
                styles.messageText, 
                msg.type === 'user' && styles.messageTextUser,
                msg.type === 'system' && styles.messageTextSystem
              ]}>{msg.text}</Text>
              {(msg.type === 'user' || msg.type === 'mediator') && (
                <Text style={[styles.timeText, msg.type === 'user' && { color: 'rgba(255,255,255,0.7)' }]}>{msg.time}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {!showResolution && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            placeholderTextColor={Colors.textTertiary}
            onSubmitEditing={handleSendMessage}
          />
          <Pressable style={styles.sendButton} onPress={handleSendMessage}>
            <MaterialIcons name="send" size={20} color={Colors.white} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, backgroundColor: Colors.white },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center' },
  formalBtn: { backgroundColor: Colors.primary, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  
  messages: { flex: 1, padding: 16 },
  message: { backgroundColor: Colors.white, padding: 12, borderRadius: 16, borderBottomLeftRadius: 0, marginBottom: 12, maxWidth: '80%', borderWidth: 1, borderColor: Colors.borderLight },
  messageUser: { backgroundColor: Colors.primary, alignSelf: 'flex-end', borderBottomLeftRadius: 16, borderBottomRightRadius: 0, borderColor: Colors.primary },
  messageSystem: { backgroundColor: 'transparent', alignSelf: 'center', borderWidth: 0, opacity: 0.6 },
  
  sender: { fontSize: 10, fontWeight: 'bold', color: Colors.primary, textTransform: 'uppercase', marginBottom: 4 },
  messageText: { fontSize: 14, color: Colors.textPrimary },
  messageTextUser: { color: Colors.white },
  messageTextSystem: { fontSize: 12, fontStyle: 'italic', textAlign: 'center' },
  timeText: { fontSize: 9, color: Colors.textTertiary, alignSelf: 'flex-end', marginTop: 4 },
  
  inputContainer: { flexDirection: 'row', padding: 16, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderLight, gap: 8 },
  input: { flex: 1, backgroundColor: Colors.backgroundLight, padding: 12, borderRadius: 16, fontSize: 14, color: Colors.textPrimary },
  sendButton: { backgroundColor: Colors.primary, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  
  resolutionPanel: { flex: 1, padding: 20 },
  resCard: { backgroundColor: Colors.white, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: Colors.borderLight },
  resTitle: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary, marginBottom: 4 },
  resSub: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },
  
  inputGroup: { gap: 8, marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: Colors.textSecondary, textTransform: 'uppercase' },
  textArea: { backgroundColor: Colors.backgroundLight, borderRadius: 12, padding: 16, height: 120, textAlignVertical: 'top', color: Colors.textPrimary },
  
  uploadBox: { height: 120, borderStyle: 'dashed', borderWidth: 2, borderColor: Colors.border, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.backgroundLight, marginBottom: 24, gap: 8 },
  uploadText: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },
  
  submitRes: { backgroundColor: Colors.success, padding: 16, borderRadius: 16, alignItems: 'center' },
  submitResText: { color: Colors.white, fontWeight: 'bold', fontSize: 16 },
});

export default MediationRoomScreen;
