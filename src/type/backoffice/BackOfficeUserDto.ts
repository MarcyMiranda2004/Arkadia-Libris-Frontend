export interface BackOfficeUserDto {
  id: number;
  name: string;
  surname: string;
  bornDate: string;
  username: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: string;
}

export interface BackOfficeCreateStaffRequestDto {
  name: string;
  surname: string;
  bornDate: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface BackOfficeAssignRoleRequestDto {
  role: string;
}
