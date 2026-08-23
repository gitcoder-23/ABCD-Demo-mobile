import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchTestCatalog, fetchTestDetail } from '../actions/testActions';
import { TestItemModel, TestCatalogResponseModel, TestDetailDataModel, TestDetailResponseModel } from '../models/testModel';

export interface TestAppState {
  tests: TestItemModel[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
  errorMessage: string | undefined;
  isError: boolean;
  
  testDetail: TestDetailDataModel | null;
  isTestDetailLoading: boolean;
  testDetailError: string | undefined;
}

const initialState: TestAppState = {
  tests: [],
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  isLoading: false,
  errorMessage: undefined,
  isError: false,
  testDetail: null,
  isTestDetailLoading: false,
  testDetailError: undefined,
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    resetTests: (state) => {
      state.tests = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalItems = 0;
      state.isLoading = false;
      state.errorMessage = undefined;
      state.isError = false;
    },
    resetTestDetail: (state) => {
      state.testDetail = null;
      state.isTestDetailLoading = false;
      state.testDetailError = undefined;
    },
  },
  extraReducers: function (builder) {
    builder.addCase(fetchTestCatalog.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = '';
    });

    builder.addCase(
      fetchTestCatalog.fulfilled,
      (state, action: PayloadAction<TestCatalogResponseModel>) => {
        state.isLoading = false;
        state.isError = false;
        
        const responseData = action.payload.data;
        if (responseData) {
          const { data, meta } = responseData;
          // If page > 1, append tests. Else, replace tests.
          if (meta.page > 1) {
            state.tests = [...state.tests, ...data];
          } else {
            state.tests = data;
          }
          
          state.currentPage = meta.page;
          state.totalPages = meta.totalPages;
          state.totalItems = meta.total;
        }
      },
    );

    builder.addCase(fetchTestCatalog.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload as string || 'Failed to fetch tests';
    });

    // fetchTestDetail cases
    builder.addCase(fetchTestDetail.pending, (state) => {
      state.isTestDetailLoading = true;
      state.testDetailError = undefined;
    });

    builder.addCase(
      fetchTestDetail.fulfilled,
      (state, action: PayloadAction<TestDetailResponseModel>) => {
        state.isTestDetailLoading = false;
        state.testDetail = action.payload.data;
      },
    );

    builder.addCase(fetchTestDetail.rejected, (state, action) => {
      state.isTestDetailLoading = false;
      state.testDetailError = action.payload as string || 'Failed to fetch test details';
    });
  },
});

export const { resetTests, resetTestDetail } = testSlice.actions;

export default testSlice.reducer;
