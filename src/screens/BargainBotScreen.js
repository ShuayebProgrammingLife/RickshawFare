import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Header from '../components/Header';
import { useSettings } from '../context/SettingsContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const BOT_RESPONSES = {
  'hi': 'আসসালামু আলাইকুম! আমি আপনার দরদামের সহায়ক। আপনি কি কোনো নির্দিষ্ট জায়গার ভাড়া জানতে চান?',
  'hello': 'Hello! I am your Bargaining Assistant. How can I help you today?',
  'rickshaw': 'রিকশার ক্ষেত্রে সবসময় মনে রাখবেন, প্রথমে চালক যে ভাড়া বলবে তার চেয়ে ২০-৩০ টাকা কম বলবেন।',
  'cng': 'সিএনজিতে মিটারে চলাই সবচেয়ে ভালো। মিটার না মানলে অন্তত ২০% কমিয়ে দরদাম শুরু করুন।',
  'rain': 'বৃষ্টির সময় ভাড়া একটু বেশি হবেই, তবে ২ গুণের বেশি দেওয়া ঠিক নয়।',
  'night': 'রাত ১০টার পর রিকশা বা সিএনজিতে ২০-৫০ টাকা অতিরিক্ত ভাড়া দাবি করা স্বাভাবিক।',
  'default': 'দুঃখিত, আমি আপনার কথা বুঝতে পারিনি। আপনি কি ভাড়া বা দরদাম নিয়ে কিছু জানতে চান?',
};

export default function BargainBotScreen() {
  const { theme, language } = useSettings();
  const [messages, setMessages] = useState([
    { id: 1, text: language === 'bn' ? 'হ্যালো! আমি আপনার দরদাম বিশেষজ্ঞ।' : 'Hello! I am your Bargaining Bot.', isBot: true }
  ]);
  const [input, setInput] = useState('');
  const scrollViewRef = useRef();

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Process response
    setTimeout(() => {
      let replyText = BOT_RESPONSES['default'];
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('হাই') || lowerInput.includes('হ্যালো') || lowerInput.includes('hi')) replyText = BOT_RESPONSES['hi'];
      else if (lowerInput.includes('রিকশা') || lowerInput.includes('rickshaw')) replyText = BOT_RESPONSES['rickshaw'];
      else if (lowerInput.includes('সিএনজি') || lowerInput.includes('cng')) replyText = BOT_RESPONSES['cng'];
      else if (lowerInput.includes('বৃষ্টি') || lowerInput.includes('rain')) replyText = BOT_RESPONSES['rain'];
      else if (lowerInput.includes('রাত') || lowerInput.includes('night')) replyText = BOT_RESPONSES['night'];

      const botReply = { id: Date.now() + 1, text: replyText, isBot: true };
      setMessages(prev => [...prev, botReply]);
    }, 500);
  };

  const QUICK_QUESTIONS = [
    { text: 'রিকশা ভাড়া', val: 'rickshaw' },
    { text: 'সিএনজি ভাড়া', val: 'cng' },
    { text: 'বৃষ্টির সময়', val: 'rain' },
    { text: 'রাতের ভাড়া', val: 'night' },
  ];

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <Header 
        title={language === 'bn' ? 'দরদাম বট' : 'Bargain Bot'} 
        subtitle={language === 'bn' ? 'দরদামে অভিজ্ঞ হতে সাহায্য নিন' : 'Get help with fare negotiation'}
      />

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {messages.map(msg => (
          <View key={msg.id} style={[
            styles.messageWrapper, 
            msg.isBot ? styles.botWrapper : styles.userWrapper
          ]}>
            {msg.isBot && (
              <View style={[styles.botAvatar, { backgroundColor: theme.primary }]}>
                <MaterialCommunityIcons name="robot" size={20} color="#fff" />
              </View>
            )}
            <View style={[
              styles.messageBubble,
              msg.isBot ? { backgroundColor: theme.card } : { backgroundColor: theme.primary }
            ]}>
              <Text style={[styles.messageText, msg.isBot ? { color: theme.text } : { color: '#fff' }]}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputArea}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickArea}>
          {QUICK_QUESTIONS.map((q, i) => (
            <TouchableOpacity 
              key={i} 
              style={[styles.quickChip, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => { setInput(q.val); handleSend(); }}
            >
              <Text style={[styles.quickText, { color: theme.textSecondary }]}>{q.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
            placeholder={language === 'bn' ? 'কিছু জিজ্ঞেস করুন...' : 'Ask something...'}
            placeholderTextColor={theme.textSecondary}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.primary }]} onPress={handleSend}>
            <MaterialCommunityIcons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    maxWidth: '85%',
  },
  botWrapper: {
    alignSelf: 'flex-start',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 5,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  inputArea: {
    padding: 15,
    paddingTop: 5,
  },
  quickArea: {
    marginBottom: 10,
  },
  quickChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  quickText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
