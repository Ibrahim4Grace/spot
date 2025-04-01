import { UserType } from '@modules/user/interface/UserInterface';

export interface CreateUserResponse {
  message: string;
  data: {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      role: UserType;
    };
    token: string;
  };
}
