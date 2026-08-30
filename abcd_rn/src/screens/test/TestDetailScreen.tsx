import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../app/redux/hooks';
import { fetchTestDetail } from '../../app/redux/actions/testActions';
import { resetTestDetail } from '../../app/redux/slices/testSlice';

const TestDetailScreen = ({ route, navigation }: any) => {
  const { testId } = route.params;
  const dispatch = useAppDispatch();
  const { testDetail, isTestDetailLoading, testDetailError } = useAppSelector(
    state => state.test,
  );

  useEffect(() => {
    dispatch(fetchTestDetail(testId));
    return () => {
      dispatch(resetTestDetail());
    };
  }, [dispatch, testId]);

  const renderHeader = (title: string) => (
    <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backBtnText}>{'‹ Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 60 }} />
      </View>
    </SafeAreaView>
  );

  if (isTestDetailLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#B71234" />
        {renderHeader('Test Details')}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#B71234" />
        </View>
      </View>
    );
  }

  if (testDetailError || !testDetail) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#B71234" />
        {renderHeader('Test Details')}
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {testDetailError || 'Test details not found.'}
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => dispatch(fetchTestDetail(testId))}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#B71234" />
      {renderHeader('Test Details')}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.testName}>{testDetail.name}</Text>
            {testDetail.fastingRequired && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>Fasting</Text>
              </View>
            )}
          </View>

          <Text style={styles.testCode}>Code: {testDetail.testCode}</Text>

          {testDetail.description && (
            <Text style={styles.description}>{testDetail.description}</Text>
          )}

          <View style={styles.priceContainer}>
            {testDetail.savingsPercent > 0 ? (
              <>
                <Text style={styles.discountedPrice}>₹{testDetail.price}</Text>
                <Text style={styles.mrp}>₹{testDetail.mrp}</Text>
                <View style={styles.savingsTag}>
                  <Text style={styles.savingsText}>
                    {testDetail.savingsPercent}% OFF
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.discountedPrice}>₹{testDetail.price}</Text>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Turnaround Time (TAT)</Text>
            <Text style={styles.detailValue}>{testDetail.tat}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Sample Type</Text>
            <Text style={styles.detailValue}>{testDetail.sampleType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Home Collection</Text>
            <Text style={styles.detailValue}>
              {testDetail.homeCollection ? 'Available' : 'Not Available'}
            </Text>
          </View>
          {testDetail.category && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{testDetail.category.name}</Text>
            </View>
          )}
        </View>

        {testDetail.instructions && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.description}>{testDetail.instructions}</Text>
          </View>
        )}

        {testDetail.parameters && testDetail.parameters.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Parameters Tested ({testDetail.parameters.length})
            </Text>
            {testDetail.parameters.map((param, index) => (
              <View key={param.id || index} style={styles.paramRow}>
                <Text style={styles.paramName}>{param.name}</Text>
                {param.unit && (
                  <Text style={styles.paramUnit}>{param.unit}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.addToCartText}>Back to Catalog</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginRight: 8,
  },
  testCode: {
    fontSize: 14,
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
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#B71234',
    marginRight: 12,
  },
  mrp: {
    fontSize: 16,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  savingsTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  savingsText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  paramName: {
    fontSize: 14,
    color: '#444444',
  },
  paramUnit: {
    fontSize: 12,
    color: '#888888',
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  addToCartBtn: {
    backgroundColor: '#B71234',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default TestDetailScreen;
