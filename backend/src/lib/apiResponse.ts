import { IApiResponse } from "./interfaces";

class ApiResponse<T = any> implements IApiResponse<T> {
  statuscode: number;
  data: T;
  message: string;
  constructor(statuscode: number, data: T, message = "Success") {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
  }
}

export { ApiResponse };
