export interface IAuthState {
  token: string;
  userId: string;
  email: string;
}

export type AddUserFunc = (token: string) => void;
