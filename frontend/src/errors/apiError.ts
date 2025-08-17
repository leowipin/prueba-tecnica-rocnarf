export class ApiError extends Error {
  public readonly status: number;
  public readonly title: string;

  constructor(title: string, description: string, status: number) {

    super(description); 
    
    this.title = title;
    this.status = status;

    this.name = 'ApiError'; 

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get description(): string {
    return this.message;
  }
}