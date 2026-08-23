class PatientModel {
  String? id;
  String? patientCode;
  String? firstName;
  String? lastName;
  String? email;
  String? mobile;
  bool? isAppEnabled;

  PatientModel({
    this.id,
    this.patientCode,
    this.firstName,
    this.lastName,
    this.email,
    this.mobile,
    this.isAppEnabled,
  });

  factory PatientModel.fromJson(Map<String, dynamic> json) {
    return PatientModel(
      id: json['id'],
      patientCode: json['patientCode'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      email: json['email'],
      mobile: json['mobile'],
      isAppEnabled: json['isAppEnabled'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'patientCode': patientCode,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'mobile': mobile,
      'isAppEnabled': isAppEnabled,
    };
  }
}

class AuthResponseDataModel {
  String? accessToken;
  String? refreshToken;
  String? tokenType;
  int? expiresIn;
  int? refreshExpiresIn;
  PatientModel? patient;

  AuthResponseDataModel({
    this.accessToken,
    this.refreshToken,
    this.tokenType,
    this.expiresIn,
    this.refreshExpiresIn,
    this.patient,
  });

  factory AuthResponseDataModel.fromJson(Map<String, dynamic> json) {
    return AuthResponseDataModel(
      accessToken: json['accessToken'] ?? json['token'],
      refreshToken: json['refreshToken'],
      tokenType: json['tokenType'],
      expiresIn: json['expiresIn'],
      refreshExpiresIn: json['refreshExpiresIn'],
      patient: json['patient'] != null
          ? PatientModel.fromJson(json['patient'])
          : (json['user'] != null ? PatientModel.fromJson(json['user']) : null),
    );
  }
}

class BaseResponseModel {
  bool? success;
  String? message;

  BaseResponseModel({this.success, this.message});

  factory BaseResponseModel.fromJson(Map<String, dynamic> json) {
    return BaseResponseModel(
      success: json['success'],
      message: json['message'],
    );
  }
}
