import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAuthStore } from '../../src/store/authStore';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';


const BLUR_INTENSITY = Platform.OS === 'ios' ? 70 : 100;

const SOCIAL_BUTTONS = [
  { icon: 'logo-google', color: '#EA4335', label: 'Google' },
  { icon: 'logo-apple', color: '#000000', label: 'Apple' },
  { icon: 'logo-facebook', color: '#1877F2', label: 'Facebook' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withSpring(1);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }
    await login(email, password);
  };

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(animation.value, [0, 1], [-50, 0]) },
      { scale: interpolate(animation.value, [0, 1], [0.8, 1]) },
    ],
    opacity: animation.value,
  }));

  const formStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(animation.value, [0, 1], [100, 0]) }],
    opacity: animation.value,
  }));

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200' }}
        style={[StyleSheet.absoluteFillObject, { opacity: 0.7 }]}
        resizeMode="cover"
      />
      
      <BlurView
        intensity={BLUR_INTENSITY}
        style={StyleSheet.absoluteFillObject}
        tint="dark"
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>App Estiam</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.formContainer, formStyle]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.formBackground}
          >
            <View style={styles.formContent}>
              {error && (
                <Animated.View 
                  entering={FadeInDown.duration(400)}
                  style={styles.errorContainer}
                >
                  <Ionicons name="alert-circle" size={20} color="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              )}

              <View style={styles.inputSection}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.6)" />
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
                </View>
                
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.actionSection}>
                <TouchableOpacity 
                  style={styles.button}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#3b82f6', '#1e40af']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Sign In</Text>
                        <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.socialSection}>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialButtons}>
                  {SOCIAL_BUTTONS.map((button, index) => (
                    <Animated.View
                      key={button.label}
                      entering={FadeInUp.delay(400 + index * 100)}
                    >
                      <TouchableOpacity 
                        style={[styles.socialButton, { backgroundColor: button.color }]}
                      >
                        <Ionicons name={button.icon as any} size={24} color="#ffffff" />
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>
              </View>

              <View style={styles.footerSection}>
                <TouchableOpacity 
                  onPress={() => router.push('/register')}
                  style={styles.linkContainer}
                >
                  <Text style={styles.linkText}>Don't have an account? </Text>
                  <Text style={[styles.linkText, styles.linkTextBold]}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  
  headerTextContainer: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 40,
  },
  formBackground: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  formContent: {
    padding: 24,
  },
  inputSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#60a5fa',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  actionSection: {
    marginBottom: 24,
  },
  button: {
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  socialSection: {
    gap: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerSection: {
    marginTop: 24,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
});