class ApiError extends Error {
    public statusCode: number;
    public message: string;
    public errors?: any[];
    public success?: boolean;
  
    constructor(
      statusCode: number,
      message: string,
      errors?: any[],
      stack?: string,
      success?: boolean
    ) {
      super(message);
      this.statusCode = statusCode;
      this.message = message;
      this.success = success || false;
      this.errors = errors || [];
  
      if (stack) {
        this.stack = stack;
      } else {
        (Error as any).captureStackTrace(this, ApiError);
      }
    }
  }
  
  export { ApiError };