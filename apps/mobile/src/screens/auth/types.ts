export type LoginFormData = {
  username: string;
  password: string;
};

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};
