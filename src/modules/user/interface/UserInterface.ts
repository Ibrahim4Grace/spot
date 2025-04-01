import { UpdateRecordGeneric } from '@shared/helpers/UpdateRecordGeneric';

export enum UserType {
  ADMIN = 'admin',
  USER = 'user',
  BORROWER = 'borrower',
  GUARANTOR = 'guarantor',
  INVESTOR = 'investor',
  OFFICER = 'officer',
}

export interface UserPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface UserInterface {
  id: string;
  pronouns: string;
  email: string;

  first_name: string;

  last_name: string;

  password: string;

  is_active: boolean;

  role: UserType;
  time_left: number;

  created_at: Date;

  updated_at: Date;

  phone?: string;
}

export type CreateNewUserOptions = Pick<UserInterface, 'email' | 'first_name' | 'last_name' | 'password' | 'role'> & {
  admin_secret?: string;
};

type UserUpdateRecord = Partial<UserInterface>;

export type UpdateUserRecordOption = UpdateRecordGeneric<UserIdentifierOptionsType, UserUpdateRecord>;

export type UserIdentifierOptionsType =
  | {
      identifierType: 'id';
      identifier: string;
    }
  | {
      identifierType: 'email';
      identifier: string;
    };
