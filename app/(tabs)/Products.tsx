import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useProductStore } from '../../src/store/productStore';

const { width } = Dimensions.get('window');

export default function ProductsScreen() {
  const { products, isLoading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts(0, 20);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchProducts()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e40af', '#3b82f6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Product Catalog</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              ${products.reduce((sum, product) => sum + product.price, 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {new Set(products.map(p => p.category.name)).size}
            </Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {products.map((product, index) => (
          <Animated.View
            key={product.id}
            entering={FadeInDown.delay(index * 100).springify()}
            style={styles.productCard}
          >
            <Image source={{ uri: product.images[0] }} style={styles.productImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            />
            <View style={styles.productContent}>
              <View style={styles.productHeader}>
                <View style={styles.categoryChip}>
                  <Ionicons name="pricetag-outline" size={14} color="#ffffff" />
                  <Text style={styles.categoryText}>{product.category.name}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <Ionicons name="ellipsis-horizontal-outline" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.productDetails}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productDescription} numberOfLines={2}>
                  {product.description}
                </Text>
              </View>

              <View style={styles.productFooter}>
                <View style={styles.priceTag}>
                  <Ionicons name="cash-outline" size={16} color="#ffffff" />
                  <Text style={styles.priceText}>${product.price}</Text>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>View Details</Text>
                  <Ionicons name="arrow-forward-outline" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      <Animated.View 
        entering={FadeInDown}
        style={styles.fab}
      >
        <TouchableOpacity style={styles.fabButton}>
          <Ionicons name="add-circle-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 12,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#ef4444',
    borderRadius: 12,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
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
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#e2e8f0',
  },
  content: {
    padding: 24,
    gap: 24,
  },
  productCard: {
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  productContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1e40af',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e40af',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});