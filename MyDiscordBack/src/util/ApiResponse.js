class ApiResponse {
  constructor(status, message, data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success(status, data) {
    return new ApiResponse(status, "OK", data);
  }

  static error(status, message, res) {
    return new ApiResponse(status, message, null);
  }

}

module.exports = { ApiResponse };