import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { useUserStore, User } from '../../src/store/userStore';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function UsersScreen() {
  const { user, logout } = useAuthStore();
  const { users, isLoading, error, fetchUsers, createUser, deleteUser } = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    avatar: 'https://picsum.photos/800',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    await createUser(newUser);
    setModalVisible(false);
    setNewUser({
      name: '',
      email: '',
      password: '',
      avatar: 'https://picsum.photos/800',
    });
  };

  const handleDeleteUser = (userId: number) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteUser(userId) },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1e40af', '#3b82f6']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.title}>Users </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="person-add-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{users.length}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {users.filter(u => u.role === 'admin').length}
              </Text>
              <Text style={styles.statLabel}>Admins</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {users.filter(u => u.role === 'customer').length}
              </Text>
              <Text style={styles.statLabel}>Customers</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.usersList}>
            {users.map((user: User, index: number) => (
              <Animated.View
                key={user.id}
                entering={FadeInDown.delay(index * 100)}
                style={styles.userCard}
              >
                <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <View style={styles.roleChip}>
                    <Ionicons 
                      name={user.role === 'admin' ? 'shield-outline' : 'person-outline'} 
                      size={14} 
                      color="#1e40af" 
                    />
                    <Text style={styles.userRole}>{user.role}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(user.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.logoutGradient}
          >
            <Ionicons name="log-out-outline" size={20} color="#ffffff" />
            <Text style={styles.logoutText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New User</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close-outline" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={newUser.name}
                onChangeText={(text) => setNewUser({ ...newUser, name: text })}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={newUser.email}
                onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={newUser.password}
                onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateUser}
            >
              <Text style={styles.createButtonText}>Create User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingVertical: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#e2e8f0',
  },
  section: {
    padding: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    color: '#ef4444',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  usersList: {
    gap: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 4,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  userRole: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1e40af',
    textTransform: 'capitalize',
  },
  deleteButton: {
    padding: 8,
  },
  logoutButton: {
    margin: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#0f172a',
  },
  createButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});