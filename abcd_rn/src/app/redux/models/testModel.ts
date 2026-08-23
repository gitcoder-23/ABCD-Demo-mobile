export interface TestItemModel {
  id: string;
  testCode: string;
  name: string;
  shortName: string | null;
  description: string | null;
  categoryId: string;
  price: number;
  discountedPrice: number | null;
  fastingRequired: boolean;
  homeCollection: boolean;
  tatHours: number;
  itemType: string;
  mrp: number;
  savingsPercent: number;
  tat: string;
}

export interface TestCatalogMetaModel {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TestCatalogDataModel {
  data: TestItemModel[];
  meta: TestCatalogMetaModel;
}

export interface TestCatalogResponseModel {
  success: boolean;
  data: TestCatalogDataModel;
}

export interface FetchTestCatalogParams {
  limit: number;
  page: number;
  search: string;
  maxPrice: any;
  minPrice: any;
  categoryId: any;
  query?: string;
}

export interface TestParameterModel {
  name: string;
  unit: string | null;
}

export interface TestDetailDataModel {
  id: string;
  itemType: string;
  testCode: string;
  name: string;
  shortName: string | null;
  description: string | null;
  category: string;
  mrp: number;
  price: number;
  savingsPercent: number;
  fastingRequired: boolean;
  homeCollection: boolean;
  tat: string;
  sampleType: string | null;
  method: string | null;
  parameters: TestParameterModel[];
}

export interface TestDetailResponseModel {
  success: boolean;
  data: TestDetailDataModel;
}
