export interface IUserService<TUser = any> {
  validateUser(credentials: { email?: string; username?: string; password: string }): Promise<TUser | null>;
  findById(id: string | number): Promise<TUser | null>;
  findByPayload(payload: any): Promise<TUser | null>;
}
