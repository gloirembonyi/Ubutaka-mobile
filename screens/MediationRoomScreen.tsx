
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface MediationRoomScreenProps {
  onNavigate: (screen: Screen) => void;
  disputeId: string | null;
}

const MediationRoomScreen: React.FC<MediationRoomScreenProps> = ({ onNavigate, disputeId }) => {
  const [message, setMessage] = useState('');
  const [messages] = useState([
    { id: '1', type: 'system', text: 'Mediation session started' },
    { id: '2', type: 'mediator', text: 'Welcome to the mediation room. Let\'s discuss the dispute.', sender: 'Mediator' },
  ]);

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dispute-detail')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Mediation Room</Text>
      </View>
      <ScrollView style={styles.messages} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.message, msg.type === 'user' && styles.messageUser]}>
            {msg.type !== 'system' && <Text style={styles.sender}>{msg.sender}</Text>}
            <Text style={[styles.messageText, msg.type === 'user' && styles.messageTextUser]}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          placeholderTextColor={Colors.textTertiary}
        />
        <Pressable style={styles.sendButton}>
          <MaterialIcons name="send" size={20} color={Colors.white} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center', marginRight: 40 },
  messages: { flex: 1, padding: 16, gap: 16 },
  message: { backgroundColor: Colors.backgroundLight, padding: 12, borderRadius: 12, gap: 4, marginBottom: 12 },
  messageUser: { backgroundColor: Colors.primary, alignSelf: 'flex-end' },
  sender: { fontSize: 8, fontWeight: 'bold', color: Colors.textTertiary, textTransform: 'uppercase' },
  messageText: { fontSize: 14, color: Colors.textPrimary },
  messageTextUser: { color: Colors.white },
  inputContainer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: Colors.borderLight, gap: 8 },
  input: { flex: 1, backgroundColor: Colors.backgroundLight, padding: 12, borderRadius: 12, fontSize: 14, color: Colors.textPrimary },
  sendButton: { backgroundColor: Colors.primary, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});

export default MediationRoomScreen;
