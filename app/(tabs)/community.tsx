import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Users,
  Search,
  Plus,
  Lock,
  Unlock,
  TrendingUp,
  Briefcase,
} from 'lucide-react-native';
import { useCommunity } from '@/contexts/CommunityContext';
import { useApp } from '@/contexts/AppContext';
import { mockGroups } from '@/mocks/community';



type TabType = 'groups' | 'networking';

export default function CommunityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const { groups, joinGroup, joinedGroupIds } = useCommunity();
  const [activeTab, setActiveTab] = useState<TabType>('groups');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false);
  const [showHoverLabel, setShowHoverLabel] = useState<boolean>(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: '',
    isOpen: true,
  });

  const plusIconScale = useRef(new Animated.Value(1)).current;
  const plusIconRotate = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(0)).current;

  const allGroups = groups.length > 0 ? groups : mockGroups;

  const filteredGroups = allGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroupPress = () => {
    setShowCreateGroup(true);
  };

  const handlePlusIconHover = (isHovering: boolean) => {
    if (isHovering) {
      Animated.parallel([
        Animated.spring(plusIconScale, {
          toValue: 1.1,
          useNativeDriver: true,
        }),
        Animated.timing(plusIconRotate, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(labelOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      setShowHoverLabel(true);
    } else {
      Animated.parallel([
        Animated.spring(plusIconScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(plusIconRotate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(labelOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShowHoverLabel(false));
    }
  };

  const rotateInterpolate = plusIconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const handleJoinGroup = async (groupId: string) => {
    if (user) {
      await joinGroup(groupId, user.id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Community</Text>
          <TouchableOpacity
            style={styles.createGroupButton}
            onPress={handleCreateGroupPress}
            onPressIn={() => handlePlusIconHover(true)}
            onPressOut={() => handlePlusIconHover(false)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.plusIconContainer,
                {
                  transform: [{ scale: plusIconScale }, { rotate: rotateInterpolate }],
                },
              ]}
            >
              <Plus size={24} color="#fff" strokeWidth={2.5} />
            </Animated.View>
            {showHoverLabel && (
              <Animated.Text
                style={[
                  styles.createGroupLabel,
                  {
                    opacity: labelOpacity,
                  },
                ]}
              >
                Create Group
              </Animated.Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'groups' && styles.tabActive]}
            onPress={() => setActiveTab('groups')}
            activeOpacity={0.7}
          >
            <Users size={20} color={activeTab === 'groups' ? '#4A90E2' : '#666'} />
            <Text style={[styles.tabText, activeTab === 'groups' && styles.tabTextActive]}>
              Groups
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'networking' && styles.tabActive]}
            onPress={() => setActiveTab('networking')}
            activeOpacity={0.7}
          >
            <Briefcase size={20} color={activeTab === 'networking' ? '#4A90E2' : '#666'} />
            <Text style={[styles.tabText, activeTab === 'networking' && styles.tabTextActive]}>
              Networking
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder={activeTab === 'groups' ? 'Search groups...' : 'Search professionals...'}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {activeTab === 'groups' ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={18} color="#4A90E2" />
              <Text style={styles.sectionTitle}>Popular Groups</Text>
            </View>
            {filteredGroups.map((group) => {
              const isJoined = joinedGroupIds.includes(group.id);
              return (
                <TouchableOpacity
                  key={group.id}
                  style={styles.groupCard}
                  onPress={() => {
                    if (isJoined) {
                      router.push(`/community/group/${group.id}` as any);
                    }
                  }}
                  activeOpacity={0.9}
                >
                  {group.coverImage && group.coverImage.trim() !== '' ? (
                    <Image source={{ uri: group.coverImage }} style={styles.groupImage} />
                  ) : (
                    <View style={[styles.groupImage, styles.placeholderImage]}>
                      <Users size={40} color="#ccc" />
                    </View>
                  )}
                  <View style={styles.groupContent}>
                    <View style={styles.groupHeader}>
                      <Text style={styles.groupName}>{group.name}</Text>
                      {group.isOpen ? (
                        <Unlock size={16} color="#10b981" />
                      ) : (
                        <Lock size={16} color="#f59e0b" />
                      )}
                    </View>
                    <Text style={styles.groupCategory}>{group.category}</Text>
                    <Text style={styles.groupDescription} numberOfLines={2}>
                      {group.description}
                    </Text>
                    <View style={styles.groupFooter}>
                      <View style={styles.groupStats}>
                        <Users size={14} color="#666" />
                        <Text style={styles.groupStatsText}>
                          {group.memberCount.toLocaleString()} members
                        </Text>
                      </View>
                      {!isJoined ? (
                        <TouchableOpacity
                          style={styles.joinButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleJoinGroup(group.id);
                          }}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.joinButtonText}>
                            {group.isOpen ? 'Join' : 'Request'}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.joinedBadge}>
                          <Text style={styles.joinedBadgeText}>Joined</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Briefcase size={18} color="#4A90E2" />
              <Text style={styles.sectionTitle}>Professional Network</Text>
            </View>
            <Text style={styles.comingSoonText}>
              Professional networking features coming soon! Connect with professionals in your
              industry.
            </Text>
          </View>
        </ScrollView>
      )}

      <Modal
        visible={showCreateGroup}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateGroup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Group</Text>
              <TouchableOpacity onPress={() => setShowCreateGroup(false)}>
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
                  value={newGroup.name}
                  onChangeText={(text) => setNewGroup({ ...newGroup, name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="What's this group about?"
                  placeholderTextColor="#999"
                  value={newGroup.description}
                  onChangeText={(text) => setNewGroup({ ...newGroup, description: text })}
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
                  value={newGroup.category}
                  onChangeText={(text) => setNewGroup({ ...newGroup, category: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Privacy</Text>
                <View style={styles.privacyToggle}>
                  <TouchableOpacity
                    style={[
                      styles.privacyOption,
                      newGroup.isOpen && styles.privacyOptionActive,
                    ]}
                    onPress={() => setNewGroup({ ...newGroup, isOpen: true })}
                    activeOpacity={0.7}
                  >
                    <Unlock
                      size={18}
                      color={newGroup.isOpen ? '#4A90E2' : '#666'}
                    />
                    <Text
                      style={[
                        styles.privacyOptionText,
                        newGroup.isOpen && styles.privacyOptionTextActive,
                      ]}
                    >
                      Open
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.privacyOption,
                      !newGroup.isOpen && styles.privacyOptionActive,
                    ]}
                    onPress={() => setNewGroup({ ...newGroup, isOpen: false })}
                    activeOpacity={0.7}
                  >
                    <Lock
                      size={18}
                      color={!newGroup.isOpen ? '#4A90E2' : '#666'}
                    />
                    <Text
                      style={[
                        styles.privacyOptionText,
                        !newGroup.isOpen && styles.privacyOptionTextActive,
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
                style={styles.createButton}
                onPress={() => {
                  setShowCreateGroup(false);
                  setNewGroup({ name: '', description: '', category: '', isOpen: true });
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.createButtonText}>Create Group</Text>
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
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#1a1a1a',
  },
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plusIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createGroupLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4A90E2',
    position: 'absolute',
    right: 52,
    whiteSpace: 'nowrap' as any,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  tabActive: {
    backgroundColor: '#E8F4FF',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#666',
  },
  tabTextActive: {
    color: '#4A90E2',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
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
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  groupImage: {
    width: '100%',
    height: 140,
  },
  placeholderImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupContent: {
    padding: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    flex: 1,
  },
  groupCategory: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupStatsText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500' as const,
  },
  joinButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  joinedBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E8F4FF',
  },
  joinedBadgeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#4A90E2',
  },
  comingSoonText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    paddingVertical: 40,
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
  createButton: {
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
  createButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
