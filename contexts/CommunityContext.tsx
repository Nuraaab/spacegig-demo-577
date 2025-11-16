import { useState, useCallback, useMemo, useEffect } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  coverImage: string;
  isOpen: boolean;
  adminIds: string[];
  memberIds: string[];
  subgroups: Subgroup[];
  memberCount: number;
  createdAt: string;
}

export interface Subgroup {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
}

export interface Post {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  createdAt: string;
}

export interface CommunityUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  skills?: string[];
  industries?: string[];
  interests?: string[];
  budget?: number;
  gender?: string;
  lifestyle?: string[];
  amenityPreferences?: string[];
  lookingForRoommate?: boolean;
  professionalNetworking?: boolean;
}

export interface JoinRequest {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'declined';
}

export interface UserInteraction {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: 'like' | 'nudge';
  createdAt: string;
}

export const [CommunityProvider, useCommunity] = createContextHook(() => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [userInteractions, setUserInteractions] = useState<UserInteraction[]>([]);
  const [nudgeCount, setNudgeCount] = useState<number>(3);
  const [lastNudgeReset, setLastNudgeReset] = useState<string>(new Date().toISOString());
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadStoredData = useCallback(async () => {
    try {
      const [storedGroups, storedRequests, storedInteractions, storedNudges, storedJoinedGroups] = await Promise.all([
        AsyncStorage.getItem('community_groups'),
        AsyncStorage.getItem('community_joinRequests'),
        AsyncStorage.getItem('community_userInteractions'),
        AsyncStorage.getItem('community_nudgeCount'),
        AsyncStorage.getItem('community_joinedGroups'),
      ]);

      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      }

      if (storedRequests) {
        setJoinRequests(JSON.parse(storedRequests));
      }

      if (storedInteractions) {
        setUserInteractions(JSON.parse(storedInteractions));
      }

      if (storedNudges) {
        const data = JSON.parse(storedNudges);
        setNudgeCount(data.count);
        setLastNudgeReset(data.lastReset);
      }

      if (storedJoinedGroups) {
        setJoinedGroupIds(JSON.parse(storedJoinedGroups));
      }
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  useEffect(() => {
    const now = new Date();
    const lastReset = new Date(lastNudgeReset);
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (daysSinceReset >= 1) {
      setNudgeCount(3);
      setLastNudgeReset(now.toISOString());
      AsyncStorage.setItem('community_nudgeCount', JSON.stringify({ count: 3, lastReset: now.toISOString() }));
    }
  }, [lastNudgeReset]);

  const createGroup = useCallback(async (groupData: Omit<Group, 'id' | 'memberIds' | 'memberCount' | 'createdAt'>) => {
    const newGroup: Group = {
      ...groupData,
      id: Date.now().toString(),
      memberIds: [groupData.adminIds[0]],
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    await AsyncStorage.setItem('community_groups', JSON.stringify(updatedGroups));
    
    return newGroup;
  }, [groups]);

  const joinGroup = useCallback(async (groupId: string, userId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    if (group.isOpen) {
      const updatedGroups = groups.map(g => 
        g.id === groupId 
          ? { ...g, memberIds: [...g.memberIds, userId], memberCount: g.memberCount + 1 }
          : g
      );
      setGroups(updatedGroups);
      const updatedJoinedGroups = [...joinedGroupIds, groupId];
      setJoinedGroupIds(updatedJoinedGroups);
      await AsyncStorage.setItem('community_groups', JSON.stringify(updatedGroups));
      await AsyncStorage.setItem('community_joinedGroups', JSON.stringify(updatedJoinedGroups));
    } else {
      const newRequest: JoinRequest = {
        id: Date.now().toString(),
        groupId,
        userId,
        userName: 'Current User',
        userAvatar: 'https://i.pravatar.cc/150?img=8',
        requestedAt: new Date().toISOString(),
        status: 'pending',
      };

      const updatedRequests = [...joinRequests, newRequest];
      setJoinRequests(updatedRequests);
      await AsyncStorage.setItem('community_joinRequests', JSON.stringify(updatedRequests));
    }
  }, [groups, joinRequests, joinedGroupIds]);

  const handleJoinRequest = useCallback(async (requestId: string, approve: boolean) => {
    const request = joinRequests.find(r => r.id === requestId);
    if (!request) return;

    const updatedRequests = joinRequests.map(r =>
      r.id === requestId
        ? { ...r, status: approve ? 'approved' as const : 'declined' as const }
        : r
    );
    setJoinRequests(updatedRequests);

    if (approve) {
      const updatedGroups = groups.map(g =>
        g.id === request.groupId
          ? { ...g, memberIds: [...g.memberIds, request.userId], memberCount: g.memberCount + 1 }
          : g
      );
      setGroups(updatedGroups);
      await AsyncStorage.setItem('community_groups', JSON.stringify(updatedGroups));
    }

    await AsyncStorage.setItem('community_joinRequests', JSON.stringify(updatedRequests));
  }, [joinRequests, groups]);

  const likeUser = useCallback(async (fromUserId: string, toUserId: string) => {
    const interaction: UserInteraction = {
      id: Date.now().toString(),
      fromUserId,
      toUserId,
      type: 'like',
      createdAt: new Date().toISOString(),
    };

    const updatedInteractions = [...userInteractions, interaction];
    setUserInteractions(updatedInteractions);
    await AsyncStorage.setItem('community_userInteractions', JSON.stringify(updatedInteractions));
  }, [userInteractions]);

  const nudgeUser = useCallback(async (fromUserId: string, toUserId: string) => {
    if (nudgeCount <= 0) {
      throw new Error('No nudges remaining this month');
    }

    const interaction: UserInteraction = {
      id: Date.now().toString(),
      fromUserId,
      toUserId,
      type: 'nudge',
      createdAt: new Date().toISOString(),
    };

    const updatedInteractions = [...userInteractions, interaction];
    const newNudgeCount = nudgeCount - 1;
    
    setUserInteractions(updatedInteractions);
    setNudgeCount(newNudgeCount);
    
    await AsyncStorage.setItem('community_userInteractions', JSON.stringify(updatedInteractions));
    await AsyncStorage.setItem('community_nudgeCount', JSON.stringify({ count: newNudgeCount, lastReset: lastNudgeReset }));
  }, [userInteractions, nudgeCount, lastNudgeReset]);

  const getPendingRequests = useCallback((groupId: string) => {
    return joinRequests.filter(r => r.groupId === groupId && r.status === 'pending');
  }, [joinRequests]);

  const isGroupMember = useCallback((groupId: string, userId: string) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.memberIds.includes(userId) : false;
  }, [groups]);

  const isGroupAdmin = useCallback((groupId: string, userId: string) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.adminIds.includes(userId) : false;
  }, [groups]);

  return useMemo(() => ({
    groups,
    joinRequests,
    userInteractions,
    nudgeCount,
    joinedGroupIds,
    isLoading,
    createGroup,
    joinGroup,
    handleJoinRequest,
    likeUser,
    nudgeUser,
    getPendingRequests,
    isGroupMember,
    isGroupAdmin,
  }), [
    groups,
    joinRequests,
    userInteractions,
    nudgeCount,
    joinedGroupIds,
    isLoading,
    createGroup,
    joinGroup,
    handleJoinRequest,
    likeUser,
    nudgeUser,
    getPendingRequests,
    isGroupMember,
    isGroupAdmin,
  ]);
});
