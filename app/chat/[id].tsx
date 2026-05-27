import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import ScreenContainer from "@/components/ScreenContainer";
import { Message } from "@/convex/chat";

export default function ChatScreen() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const flatListRef = useRef<FlatList<Message>>(null);

  const [inputText, setInputText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Отримуємо повідомлення, якщо chatId існує, інакше повертаємо порожній масив
  const messagesData = useQuery(
    api.chat.getMessages,
    chatId ? { chatId } : "skip",
  );
  const messages: Message[] = messagesData || [];

  const send = useMutation(api.chat.sendMessage);
  const react = useMutation(api.chat.toggleReaction);
  const remove = useMutation(api.chat.deleteMessage);

  const handleSend = async () => {
    if (!inputText.trim() || !user?._id || !chatId) return;

    try {
      await send({
        chatId,
        senderId: user._id,
        text: inputText.trim(),
      });
      setInputText("");
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleLongPressMessage = (message: Message) => {
    setSelectedMessage(message);
    setMenuVisible(true);
  };

  const handleAddReaction = async (emoji: string) => {
    if (!selectedMessage || !user?._id) return;
    try {
      await react({
        messageId: selectedMessage._id,
        userId: user._id,
        emoji,
      });
    } catch (error) {
      console.error("Error adding reaction:", error);
    } finally {
      setMenuVisible(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage || !user?._id) return;

    // Використовуємо звичайний швидкий alert для підтвердження
    try {
      await remove({
        messageId: selectedMessage._id,
        userId: user._id,
      });
    } catch (error) {
      alert("Error: You can only delete your own messages.");
      console.error("Error deleting message:", error);
    } finally {
      setMenuVisible(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.senderId === user?._id;

    return (
      <TouchableOpacity
        onLongPress={() => handleLongPressMessage(item)}
        activeOpacity={0.8}
        style={[
          styles.messageRow,
          isMe ? styles.myMessageRow : styles.theirMessageRow,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myBubble : styles.theirBubble,
            item.isDeleted && styles.deletedBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMe ? styles.messageTextMy : styles.messageTextTheir,
              item.isDeleted && styles.deletedText,
            ]}
          >
            {item.text}
          </Text>

          {/* Відображення списку емодзі-реакцій */}
          {item.reactions && item.reactions.length > 0 && (
            <View style={styles.reactionsContainer}>
              {item.reactions.map((r, idx) => (
                <Text key={idx} style={styles.reactionEmoji}>
                  {r.emoji}
                </Text>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer withScroll={false}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        inverted // Відображення списку знизу догори
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Модальне контекстне меню */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {!selectedMessage?.isDeleted && (
              <View style={styles.emojiRow}>
                {["❤️", "👍", "🔥", "😂", "😮", "😢"].map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => handleAddReaction(emoji)}
                    style={styles.emojiButton}
                  >
                    <Text style={{ fontSize: 24 }}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedMessage?.senderId === user?._id &&
              !selectedMessage?.isDeleted && (
                <TouchableOpacity
                  onPress={handleDeleteMessage}
                  style={styles.deleteMenuButton}
                >
                  <Ionicons name="trash-outline" size={20} color="red" />
                  <Text style={styles.deleteMenuText}>Delete Message</Text>
                </TouchableOpacity>
              )}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputBorder,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: Colors.textMain },
  messagesList: { paddingHorizontal: 16, paddingBottom: 16 },
  messageRow: { flexDirection: "row", marginVertical: 6, width: "100%" },
  myMessageRow: { justifyContent: "flex-end" },
  theirMessageRow: { justifyContent: "flex-start" },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 18,
    position: "relative",
  },
  myBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: Colors.inputBack,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  deletedBubble: {
    backgroundColor: "#f2f2f2",
    borderColor: "#e0e0e0",
  },
  messageText: { fontSize: 15 },
  messageTextMy: { color: "white" },
  messageTextTheir: { color: Colors.textMain },
  deletedText: { color: "#999", fontStyle: "italic" },
  reactionsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: -10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  reactionEmoji: { fontSize: 11, marginHorizontal: 1 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.inputBorder,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    backgroundColor: Colors.inputBack,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
    color: Colors.textMain,
  },
  sendButton: {
    backgroundColor: Colors.secondary,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    width: "85%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  emojiButton: { padding: 4 },
  deleteMenuButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  deleteMenuText: {
    color: "red",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
});
