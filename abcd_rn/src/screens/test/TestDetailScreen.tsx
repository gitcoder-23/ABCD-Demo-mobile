import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../app/redux/hooks';
import { fetchTestDetail } from '../../app/redux/actions/testActions';
import { resetTestDetail } from '../../app/redux/slices/testSlice';

const TestDetailScreen = ({ route, navigation }: any) => {
  const { testId } = route.params;
  const dispatch = useAppDispatch();
  const { testDetail, isTestDetailLoading, testDetailError } = useAppSelector(state => state.test);

  useEffect(() => {
    dispatch(fetchTestDetail(testId));
    return () => {
      dispatch(resetTestDetail());
    };
  }, [dispatch, testId]);

  if (isTestDetailLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Test Details</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#B71234" />
        </View>
      </SafeAreaView>
    );
  }

  if (testDetailError || !testDetail) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Test Details</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{testDetailError || 'Test details not found.'}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => dispatch(fetchTestDetail(testId))}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Details</Text>
        <View style={{ width: 60 }} />
      </View>

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
                  <Text style={styles.savingsText}>{testDetail.savingsPercent}% OFF</Text>
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
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{testDetail.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Turn Around Time:</Text>
            <Text style={styles.detailValue}>{testDetail.tat}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Home Collection:</Text>
            <Text style={styles.detailValue}>{testDetail.homeCollection ? 'Available' : 'Not Available'}</Text>
          </View>
          {testDetail.sampleType && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sample Type:</Text>
              <Text style={styles.detailValue}>{testDetail.sampleType}</Text>
            </View>
          )}
          {testDetail.method && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Method:</Text>
              <Text style={styles.detailValue}>{testDetail.method}</Text>
            </View>
          )}
        </View>

        {testDetail.parameters && testDetail.parameters.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Parameters ({testDetail.parameters.length})</Text>
            {testDetail.parameters.map((param, index) => (
              <View key={index} style={styles.paramRow}>
                <Text style={styles.paramName}>• {param.name}</Text>
                {param.unit && <Text style={styles.paramUnit}>{param.unit}</Text>}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartBtn}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backBtn: {
    padding: 8,
  },
  backBtnText: {
    color: '#B71234',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space for bottom bar
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
