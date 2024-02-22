class ApiResponse {
    constructor(
        public statusCode: number,
        public data: any,
        public message: string,
        public success?: boolean
      ){
    (this.statusCode = statusCode),
      (this.data = data),
      (this.message = message);
    this.success = true;
  }
}

export { ApiResponse };
