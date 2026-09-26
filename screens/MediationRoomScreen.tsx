
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { User, Screen, Dispute } from '../types';
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
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [sending, setSending] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const isMediator = user?.role === 'ABUNZI' || user?.role === 'ADMIN';

  const parseList = (value: unknown): any[] => {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string' || !value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const formatTime = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? date : d.toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  // Chat messages are the dispute's persisted statements.
  const statements = parseList(dispute?.statements);
  const messages = [
    ...(dispute
      ? [{ id: 'opened', type: 'system', text: `Case opened ${formatTime(dispute.dateOpened)} - status: ${dispute.status}`, sender: '', time: '' }]
      : []),
    ...statements.map((st: any, i: number) => {
      const sender = st.party || st.author || 'Participant';
      return {
        id: `st-${i}`,
        type: sender === user?.name ? 'user' : 'mediator',
        text: st.text || st.content || '',
        sender,
        time: formatTime(st.date),
      };
    }),
  ];

  const loadDispute = useCallback(async (silent = false) => {
    if (!disputeId) {
      setLoadingRoom(false);
      return;
    }
    if (!silent) setLoadingRoom(true);
    try {
      const resp = await fetch(API_ENDPOINTS.DISPUTE_BY_ID(disputeId));
      if (!resp.ok) throw new Error(`Server responded ${resp.status}`);
      const data: Dispute = await resp.json();
      setDispute(data);
      setRoomError(null);
    } catch (err: any) {
      if (!silent) setRoomError(err?.message || 'Could not load the mediation room');
    } finally {
      setLoadingRoom(false);
    }
  }, [disputeId]);

  useEffect(() => {
    loadDispute();
    // Poll so messages from the other parties appear.
    const interval = setInterval(() => loadDispute(true), 8000);
    return () => clearInterval(interval);
  }, [loadDispute]);

  const handleSendMessage = async () => {
    const text = message.trim();
    if (!text || !disputeId || sending) return;
    setSending(true);
    try {
      // Re-read the latest statements to avoid overwriting messages sent by others.
      const latestResp = await fetch(API_ENDPOINTS.DISPUTE_BY_ID(disputeId));
      const latest: Dispute | null = latestResp.ok ? await latestResp.json() : dispute;
      const current = parseList(latest?.statements);
      const entry = {
        party: user?.name || 'Participant',
        author: user?.name || 'Participant',
        text,
        content: text,
        date: new Date().toISOString(),
      };
      const resp = await fetch(API_ENDPOINTS.DISPUTE_BY_ID(disputeId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statements: [...current, entry] }),
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body?.error || `Server responded ${resp.status}`);
      }
      const updated: Dispute = await resp.json();
      setDispute(updated);
      setMessage('');
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 0);
    } catch (err: any) {
      Alert.alert('Message not sent', err?.message || 'Network error.');
    } finally {
      setSending(false);
    }
  };

  const handleFormalize = async () => {
    if (!disputeId) return;
    if (!isMediator) {
      Alert.alert('Not allowed', 'Only the assigned Abunzi mediator can formalize a resolution.');
      return;
    }
    if (!outcome.trim()) {
      Alert.alert('Outcome required', 'Describe the agreed resolution before formalizing it.');
      return;
    }
    setLoading(true);
    try {
      const decisions = parseList(dispute?.decisions);
      const resp = await fetch(API_ENDPOINTS.DISPUTE_BY_ID(disputeId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Resolved',
          decisions: [
            ...decisions,
            { date: new Date().toISOString(), text: outcome.trim(), by: user?.name },
          ],
        })
      });
      if (resp.ok) {
        Alert.alert('Resolved', 'The resolution has been recorded on the case file.');
        onNavigate(user?.role === 'ABUNZI' ? 'abunzi-dashboard' : 'dashboard');
      } else {
        const body = await resp.json().catch(() => ({}));
        Alert.alert('Error', body?.error || 'Failed to formalize resolution. Please try again.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network error.');
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
        {isMediator ? (
          <Pressable
            onPress={() => setShowResolution(!showResolution)}
            style={styles.formalBtn}
          >
            <MaterialIcons name="gavel" size={20} color={Colors.white} />
          </Pressable>
        ) : (
          <Pressable onPress={() => loadDispute()} style={styles.formalBtn}>
            <MaterialIcons name="refresh" size={20} color={Colors.white} />
          </Pressable>
        )}
      </View>

      {showResolution ? (
        <ScrollView style={styles.resolutionPanel} contentContainerStyle={{ paddingBottom: 150 }}>
          <View style={styles.resCard}>
            <Text style={styles.resTitle}>Formalize Resolution</Text>
            <Text style={styles.resSub}>Record the final outcome. It is saved to the case decisions and the dispute is marked Resolved.</Text>

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


            <Pressable
              style={[styles.submitRes, loading && { opacity: 0.7 }]}
              onPress={handleFormalize}
              disabled={loading}
            >
              {loading ? (
                 <ActivityIndicator color={Colors.white} />
              ) : (
                 <Text style={styles.submitResText}>Record Resolution</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {loadingRoom && <ActivityIndicator color={Colors.primary} style={{ marginVertical: 24 }} />}
          {!loadingRoom && (roomError || !disputeId) && (
            <View style={[styles.message, styles.messageSystem]}>
              <Text style={[styles.messageText, styles.messageTextSystem]}>
                {!disputeId ? 'No dispute selected.' : `Could not load the mediation room: ${roomError}`}
              </Text>
            </View>
          )}
          {!loadingRoom && dispute && statements.length === 0 && (
            <View style={[styles.message, styles.messageSystem]}>
              <Text style={[styles.messageText, styles.messageTextSystem]}>No messages yet. Statements you send are saved to the case file.</Text>
            </View>
          )}
          {messages.map((msg) => (
            <View key={msg.id} style={[
              styles.message,
              msg.type === 'user' && styles.messageUser,
              msg.type === 'system' && styles.messageSystem
            ]}>
              {msg.type === 'mediator' && !!msg.sender && <Text style={styles.sender}>{msg.sender}</Text>}
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
          <Pressable
            style={[styles.sendButton, (sending || !dispute) && { opacity: 0.6 }]}
            onPress={handleSendMessage}
            disabled={sending || !dispute}
          >
            {sending ? <ActivityIndicator size="small" color={Colors.white} /> : <MaterialIcons name="send" size={20} color={Colors.white} />}
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
