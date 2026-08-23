class TestItemModel {
  String id;
  String testCode;
  String name;
  String? shortName;
  String? description;
  String categoryId;
  double price;
  double? discountedPrice;
  bool fastingRequired;
  bool homeCollection;
  int tatHours;
  String itemType;
  double mrp;
  double savingsPercent;
  String tat;

  TestItemModel({
    required this.id,
    required this.testCode,
    required this.name,
    this.shortName,
    this.description,
    required this.categoryId,
    required this.price,
    this.discountedPrice,
    required this.fastingRequired,
    required this.homeCollection,
    required this.tatHours,
    required this.itemType,
    required this.mrp,
    required this.savingsPercent,
    required this.tat,
  });

  factory TestItemModel.fromJson(Map<String, dynamic> json) {
    return TestItemModel(
      id: json['id'],
      testCode: json['testCode'],
      name: json['name'],
      shortName: json['shortName'],
      description: json['description'],
      categoryId: json['categoryId'],
      price: (json['price'] ?? 0).toDouble(),
      discountedPrice: json['discountedPrice'] != null
          ? json['discountedPrice'].toDouble()
          : null,
      fastingRequired: json['fastingRequired'] ?? false,
      homeCollection: json['homeCollection'] ?? false,
      tatHours: json['tatHours'] ?? 0,
      itemType: json['itemType'] ?? '',
      mrp: (json['mrp'] ?? 0).toDouble(),
      savingsPercent: (json['savingsPercent'] ?? 0).toDouble(),
      tat: json['tat'] ?? '',
    );
  }
}

class TestCatalogMetaModel {
  int total;
  int page;
  int limit;
  int totalPages;

  TestCatalogMetaModel({
    required this.total,
    required this.page,
    required this.limit,
    required this.totalPages,
  });

  factory TestCatalogMetaModel.fromJson(Map<String, dynamic> json) {
    return TestCatalogMetaModel(
      total: json['total'] ?? 0,
      page: json['page'] ?? 0,
      limit: json['limit'] ?? 0,
      totalPages: json['totalPages'] ?? 0,
    );
  }
}

class TestCatalogDataModel {
  List<TestItemModel> data;
  TestCatalogMetaModel meta;

  TestCatalogDataModel({required this.data, required this.meta});

  factory TestCatalogDataModel.fromJson(Map<String, dynamic> json) {
    var dataList = json['data'] as List? ?? [];
    List<TestItemModel> tests = dataList
        .map((i) => TestItemModel.fromJson(i))
        .toList();

    return TestCatalogDataModel(
      data: tests,
      meta: TestCatalogMetaModel.fromJson(json['meta'] ?? {}),
    );
  }
}

class TestCatalogResponseModel {
  bool success;
  TestCatalogDataModel? data;

  TestCatalogResponseModel({required this.success, this.data});

  factory TestCatalogResponseModel.fromJson(Map<String, dynamic> json) {
    return TestCatalogResponseModel(
      success: json['success'] ?? false,
      data: json['data'] != null
          ? TestCatalogDataModel.fromJson(json['data'])
          : null,
    );
  }
}

class TestParameterModel {
  String name;
  String? unit;

  TestParameterModel({required this.name, this.unit});

  factory TestParameterModel.fromJson(Map<String, dynamic> json) {
    return TestParameterModel(name: json['name'] ?? '', unit: json['unit']);
  }
}

class TestDetailDataModel {
  String id;
  String itemType;
  String testCode;
  String name;
  String? shortName;
  String? description;
  String category;
  double mrp;
  double price;
  double savingsPercent;
  bool fastingRequired;
  bool homeCollection;
  String tat;
  String? sampleType;
  String? method;
  List<TestParameterModel> parameters;

  TestDetailDataModel({
    required this.id,
    required this.itemType,
    required this.testCode,
    required this.name,
    this.shortName,
    this.description,
    required this.category,
    required this.mrp,
    required this.price,
    required this.savingsPercent,
    required this.fastingRequired,
    required this.homeCollection,
    required this.tat,
    this.sampleType,
    this.method,
    required this.parameters,
  });

  factory TestDetailDataModel.fromJson(Map<String, dynamic> json) {
    var paramList = json['parameters'] as List? ?? [];
    List<TestParameterModel> parametersList = paramList
        .map((i) => TestParameterModel.fromJson(i))
        .toList();

    return TestDetailDataModel(
      id: json['id'] ?? '',
      itemType: json['itemType'] ?? '',
      testCode: json['testCode'] ?? '',
      name: json['name'] ?? '',
      shortName: json['shortName'],
      description: json['description'],
      category: json['category'] ?? '',
      mrp: (json['mrp'] ?? 0).toDouble(),
      price: (json['price'] ?? 0).toDouble(),
      savingsPercent: (json['savingsPercent'] ?? 0).toDouble(),
      fastingRequired: json['fastingRequired'] ?? false,
      homeCollection: json['homeCollection'] ?? false,
      tat: json['tat'] ?? '',
      sampleType: json['sampleType'],
      method: json['method'],
      parameters: parametersList,
    );
  }
}

class TestDetailResponseModel {
  bool success;
  TestDetailDataModel? data;

  TestDetailResponseModel({required this.success, this.data});

  factory TestDetailResponseModel.fromJson(Map<String, dynamic> json) {
    return TestDetailResponseModel(
      success: json['success'] ?? false,
      data: json['data'] != null
          ? TestDetailDataModel.fromJson(json['data'])
          : null,
    );
  }
}
