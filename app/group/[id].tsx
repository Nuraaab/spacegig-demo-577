import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Edit,
  Users,
  MessageCircle,
  Heart,
  Zap,
  Lock,
  Unlock,
} from 'lucide-react-native';
import { useCommunity } from '@/contexts/CommunityContext';
import { useApp } from '@/contexts/AppContext';
import { mockCommunityUsers } from '@/mocks/community';

export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const groupId = Array.isArray(id) ? id[0] : id;
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const { getGroup, isGroupAdmin, updateGroup, likeUser, nudgeUser } = useCommunity();
  
  const group = getGroup(groupId);
  const isAdmin = user ? isGroupAdmin(groupId, user.id) : false;
  
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    category: '',
    coverImage: '',
    isOpen: true,
  });

  useEffect(() => {
    if (group) {
      setEditData({
        name: group.name,
        description: group.description,
        category: group.category,
        coverImage: group.coverImage,
        isOpen: group.isOpen,
      });
    }
  }, [group]);

  if (!group) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Group not found</Text>
        </View>
      </View>
    );
  }

  const members = mockCommunityUsers.filter((u) => group.memberIds.includes(u.id));

  const handleSaveEdit = async () => {
    await updateGroup(groupId, editData);
    setShowEditModal(false);
    Alert.alert('Success', 'Group updated successfully!');
  };

  const handleLike = async (memberId: string) => {
    if (user) {
      await likeUser(user.id, memberId);
      Alert.alert('Success', 'Like sent!');
    }
  };

  const handleNudge = async (memberId: string) => {
    if (user) {
      try {
        await nudgeUser(user.id, memberId);
        Alert.alert('Success', 'Nudge sent!');
      } catch {
        Alert.alert('Error', 'No nudges remaining this month');
      }
    }
  };

  const handleSayHi = (memberName: string) => {
    Alert.alert('Say Hi', `Opening chat with ${memberName}...`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        
        {isAdmin && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
            activeOpacity={0.7}
          >
            <Edit size={20} color="#4A90E2" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {group.coverImage && group.coverImage.trim() !== '' ? (
          <Image source={{ uri: group.coverImage }} style={styles.coverImage} />
        ) : (
          <View style={[styles.coverImage, styles.placeholderCover]}>
            <Users size={60} color="#ccc" />
          </View>
        )}

        <View style={styles.groupInfo}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>{group.name}</Text>
            {group.isOpen ? (
              <View style={styles.badge}>
                <Unlock size={14} color="#10b981" />
                <Text style={styles.badgeText}>Open</Text>
              </View>
            ) : (
              <View style={[styles.badge, styles.badgeClosed]}>
                <Lock size={14} color="#f59e0b" />
                <Text style={[styles.badgeText, styles.badgeTextClosed]}>Closed</Text>
              </View>
            )}
          </View>
          <Text style={styles.category}>{group.category}</Text>
          <Text style={styles.description}>{group.description}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Users size={18} color="#666" />
              <Text style={styles.statText}>{group.memberCount} members</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color="#4A90E2" />
            <Text style={styles.sectionTitle}>Members</Text>
          </View>

          {members.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberBio} numberOfLines={1}>
                  {member.bio}
                </Text>
              </View>

              <View style={styles.memberActions}>
                <TouchableOpacity
                  style={styles.sayHiButton}
                  onPress={() => handleSayHi(member.name)}
                  activeOpacity={0.7}
                >
                  <MessageCircle size={16} color="#fff" />
                  <Text style={styles.sayHiText}>Say Hi</Text>
                </TouchableOpacity>

                <View style={styles.iconActions}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleLike(member.id)}
                    activeOpacity={0.7}
                  >
                    <Heart size={18} color="#f43f5e" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleNudge(member.id)}
                    activeOpacity={0.7}
                  >
                    <Zap size={18} color="#f59e0b" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Group</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Group Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter group name"
                  placeholderTextColor="#999"
                  value={editData.name}
                  onChangeText={(text) => setEditData({ ...editData, name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="What's this group about?"
                  placeholderTextColor="#999"
                  value={editData.description}
                  onChangeText={(text) => setEditData({ ...editData, description: text })}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Faith & Spirituality"
                  placeholderTextColor="#999"
                  value={editData.category}
                  onChangeText={(text) => setEditData({ ...editData, category: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cover Image URL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://..."
                  placeholderTextColor="#999"
                  value={editData.coverImage}
                  onChangeText={(text) => setEditData({ ...editData, coverImage: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Privacy</Text>
                <View style={styles.privacyToggle}>
                  <TouchableOpacity
                    style={[
                      styles.privacyOption,
                      editData.isOpen && styles.privacyOptionActive,
                    ]}
                    onPress={() => setEditData({ ...editData, isOpen: true })}
                    activeOpacity={0.7}
                  >
                    <Unlock size={18} color={editData.isOpen ? '#4A90E2' : '#666'} />
                    <Text
                      style={[
                        styles.privacyOptionText,
                        editData.isOpen && styles.privacyOptionTextActive,
                      ]}
                    >
                      Open
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.privacyOption,
                      !editData.isOpen && styles.privacyOptionActive,
                    ]}
                    onPress={() => setEditData({ ...editData, isOpen: false })}
                    activeOpacity={0.7}
                  >
                    <Lock size={18} color={!editData.isOpen ? '#4A90E2' : '#666'} />
                    <Text
                      style={[
                        styles.privacyOptionText,
                        !editData.isOpen && styles.privacyOptionTextActive,
                      ]}
                    >
                      Closed
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E8F4FF',
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  content: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  placeholderCover: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#d1fae5',
  },
  badgeClosed: {
    backgroundColor: '#fef3c7',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#10b981',
  },
  badgeTextClosed: {
    color: '#f59e0b',
  },
  category: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500' as const,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500' as const,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  memberBio: {
    fontSize: 13,
    color: '#666',
  },
  memberActions: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'flex-end',
  },
  sayHiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
  },
  sayHiText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#fff',
  },
  iconActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  closeButton: {
    fontSize: 28,
    color: '#666',
    fontWeight: '300' as const,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 15,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  privacyToggle: {
    flexDirection: 'row',
    gap: 12,
  },
  privacyOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  privacyOptionActive: {
    backgroundColor: '#E8F4FF',
    borderColor: '#4A90E2',
  },
  privacyOptionText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#666',
  },
  privacyOptionTextActive: {
    color: '#4A90E2',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
