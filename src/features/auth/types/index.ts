export interface IAuthState {
  token: string | null;
}

export type AddUserFunc = (token: string) => void;
