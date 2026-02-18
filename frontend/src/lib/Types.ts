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

export type Document = {
  content: string;
  file_path: string;
  filename: string;
  match_score: string;
  page: number;
}

export type QueryResponse = {
  answer: string;
  content_list: Document[];
}

export type File = {
  id: number;
  file_path: string;
  filename: string;
  chunks: string;
  created_at: number;
}
