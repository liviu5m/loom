export type SignupData = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};
export type FastAPIError = {
  detail: string;
};