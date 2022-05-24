export class ServiceError extends Error {
  constructor(public status: string) {
    super(status);
  }
}
