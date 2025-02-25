import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from 'react-native-reanimated';
import { useAuthStore } from '../../src/store/authStore';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const BLUR_INTENSITY = Platform.OS === 'ios' ? 70 : 100;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, isLoading, error } = useAuthStore();

  const handleSignup = async () => {
    await signup(email, password, name);
    if (useAuthStore.getState().user) {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200' }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      
      <BlurView
        intensity={BLUR_INTENSITY}
        style={StyleSheet.absoluteFillObject}
        tint="dark"
      />
      
      <Animated.View 
        entering={FadeInDown.duration(1000).springify()}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Join the Adventure</Text>
        <Text style={styles.subtitle}>Create your new account</Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInUp.duration(1000).springify()}
        style={styles.formContainer}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
          style={styles.formBackground}
        >
          <View style={styles.form}>
            {error && (
              <Animated.View 
                entering={FadeInDown.duration(400)}
                style={styles.errorContainer}
              >
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Choose a password"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={styles.button}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#3b82f6', '#1e40af']}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>Already have an account? </Text>
              <Text style={[styles.linkText, styles.linkTextBold]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 48,
  },
  formBackground: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  form: {
    padding: 24,
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  linkTextBold: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  errorContainer: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});