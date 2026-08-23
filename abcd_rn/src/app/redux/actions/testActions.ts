import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  TestCatalogResponseModel,
  FetchTestCatalogParams,
  TestDetailResponseModel,
} from '../models/testModel';
import { testCatalogList, testDetailApi } from '../../api/config';
import rootApi from '../../api/rootApi';

export const fetchTestCatalog = createAsyncThunk<
  TestCatalogResponseModel,
  FetchTestCatalogParams,
  { rejectValue: any }
>('test/fetchCatalog', async (params, { rejectWithValue }) => {
  try {
    const { limit, page, search, maxPrice, minPrice, categoryId, query } = params;
    const url = testCatalogList(
      limit,
      page,
      search,
      maxPrice,
      minPrice,
      categoryId,
      query,
    );
    const response = await rootApi.get(url);
    console.log('fetchTestCatalog==>', response.data);

    return response.data;
  } catch (err: any) {
    console.log('fetchTestCatalog-err==>', err.response?.data);
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchTestDetail = createAsyncThunk<
  TestDetailResponseModel,
  string,
  { rejectValue: any }
>('test/fetchDetail', async (testId, { rejectWithValue }) => {
  try {
    const url = testDetailApi(testId);
    const response = await rootApi.get(url);
    console.log('fetchTestDetail==>', response.data);

    return response.data;
  } catch (err: any) {
    console.log('fetchTestDetail-err==>', err.response?.data);
    return rejectWithValue(err.response?.data || err.message);
  }
});
