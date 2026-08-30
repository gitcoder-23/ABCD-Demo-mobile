import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItemInfo,
  BackHandler,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../app/redux/hooks';
import { fetchTestCatalog } from '../../app/redux/actions/testActions';
import { TestItemModel } from '../../app/redux/models/testModel';

const TestCatalogScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { tests, isLoading, isError, errorMessage, currentPage, totalPages } =
    useAppSelector(state => state.test);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      BackHandler.exitApp();
    }
  };

  useEffect(() => {
    dispatch(
      fetchTestCatalog({
        limit: 20,
        page: 1,
        search: '',
        maxPrice: '',
        minPrice: '',
        categoryId: '',
      }),
    );
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!isLoading && currentPage < totalPages) {
      dispatch(
        fetchTestCatalog({
          limit: 20,
          page: currentPage + 1,
          search: '',
          maxPrice: '',
          minPrice: '',
          categoryId: '',
        }),
      );
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<TestItemModel>) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('TestDetail', { testId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.testName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.fastingRequired && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>Fasting</Text>
          </View>
        )}
      </View>

      <Text style={styles.testCode}>Code: {item.testCode}</Text>

      <View style={styles.priceContainer}>
        {item.savingsPercent > 0 ? (
          <>
            <Text style={styles.discountedPrice}>₹{item.price}</Text>
            <Text style={styles.mrp}>₹{item.mrp}</Text>
            <View style={styles.savingsTag}>
              <Text style={styles.savingsText}>{item.savingsPercent}% OFF</Text>
            </View>
          </>
        ) : (
          <Text style={styles.discountedPrice}>₹{item.price}</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.tatText}>Report in {item.tat}</Text>
        {item.homeCollection && (
          <Text style={styles.homeCollectionText}>Home Collection</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#B71234' }]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backBtnText}>{'‹ Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Tests</Text>
          <View style={{ width: 60 }} />
        </View>
      </SafeAreaView>

      <View style={styles.body}>
        {isError && !tests.length ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() =>
                dispatch(
                  fetchTestCatalog({
                    limit: 20,
                    page: 1,
                    search: '',
                    maxPrice: '',
                    minPrice: '',
                    categoryId: '',
                  }),
                )
              }
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={tests}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoading ? (
                <ActivityIndicator
                  size="large"
                  color="#B71234"
                  style={{ margin: 20 }}
                />
              ) : undefined
            }
            ListEmptyComponent={
              !isLoading ? (
                <View style={styles.centerContainer}>
                  <Text style={styles.emptyText}>No tests available.</Text>
                </View>
              ) : undefined
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSafeArea: {
    backgroundColor: '#B71234',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#B71234',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  testName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginRight: 8,
  },
  testCode: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#FFF4E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: '#F5A623',
    fontSize: 10,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B71234',
    marginRight: 8,
  },
  mrp: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  savingsTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  savingsText: {
    color: '#2E7D32',
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  tatText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  homeCollectionText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  errorText: {
    color: '#B71234',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#B71234',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyText: {
    color: '#666666',
    fontSize: 16,
  },
});

export default TestCatalogScreen;
