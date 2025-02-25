import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useProductStore } from '../../src/store/productStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

type CategoryIcon = "grid" | "phone-portrait" | "shirt" | "home";

const categories: { id: string; name: string; icon: CategoryIcon }[] = [
  { id: '1', name: 'All', icon: 'grid' },
  { id: '2', name: 'Electronics', icon: 'phone-portrait' },
  { id: '3', name: 'Fashion', icon: 'shirt' },
  { id: '4', name: 'Home', icon: 'home' },
];

export default function ExploreScreen() {
  const { products, isLoading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
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
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchProducts()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Discover</Text>
            <Text style={styles.subtitle}>Explore amazing products</Text>
          </View>
          
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#94a3b8" />
            <Text style={styles.searchPlaceholder}>Search products...</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <Animated.View
              key={category.id}
              entering={FadeInRight.delay(index * 100)}
            >
              <TouchableOpacity style={styles.categoryButton}>
                <View style={styles.categoryIcon}>
                  <Ionicons name={category.icon} size={20} color="#1e40af" />
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Featured Products</Text>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 20}
        >
          {products.map((product, index) => (
            <Animated.View
              key={product.id}
              entering={FadeInDown.delay(index * 200)}
              style={[styles.productCard, { width: CARD_WIDTH }]}
            >
              <Image source={{ uri: product.images[0] }} style={styles.productImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.productName}>{product.title}</Text>
                    <Text style={styles.productCategory}>{product.category.name}</Text>
                  </View>
                  <View style={styles.priceTag}>
                    <Text style={styles.price}>${product.price}</Text>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.description} numberOfLines={2}>
                    {product.description}
                  </Text>
                  <TouchableOpacity style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        <View style={styles.gridSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {products.map((product, index) => (
              <Animated.View
                key={product.id}
                entering={FadeInDown.delay(400 + index * 100)}
                style={styles.gridCard}
              >
                <Image source={{ uri: product.images[0] }} style={styles.gridImage} />
                <View style={styles.gridContent}>
                  <Text style={styles.gridTitle} numberOfLines={1}>{product.title}</Text>
                  <Text style={styles.gridPrice}>${product.price}</Text>
                  <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  greeting: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1e40af',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  searchPlaceholder: {
    color: '#94a3b8',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  categoryButton: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1e40af',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  productsContainer: {
    paddingHorizontal: 24,
    gap: 20,
    marginBottom: 32,
  },
  productCard: {
    height: 400,
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
    height: '50%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#e2e8f0',
  },
  priceTag: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1e40af',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  cardFooter: {
    gap: 12,
  },
  buyButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  gridSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e40af',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridCard: {
    width: (width - 64) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gridImage: {
    width: '100%',
    height: 150,
  },
  gridContent: {
    padding: 12,
  },
  gridTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
    marginBottom: 4,
  },
  gridPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1e40af',
  },
  addButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
  },
});