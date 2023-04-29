export class ApiError extends Error {
  private code: any;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}
