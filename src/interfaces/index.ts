import { ReactNode } from "react";
import { LoginSchema } from "../schema";
import { z } from "zod";
import { UseFormRegister } from 'react-hook-form';
import { TextFieldProps } from "@mui/material/TextField";
import { GridApi, GridColDef, GridRowId, GridKeyValue } from "@mui/x-data-grid";

export type SignInData = z.infer<typeof LoginSchema>;

export interface UserData {
  fname?: string;
  lname?: string;
  phone?: string;
  email?: string;
  gender?: string;
}
export interface FilterType {
  page: number;
  pageSize: number;
}

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  actions: {
    label: string;
    onClick: () => void;
  }[];
}

export interface RowData {
  id: number;
  project_name: string;
  project_tech: string;
  project_startat: string;
  project_deadline: string;
  project_lead: string;
  team_size: number;
  project_client: string;
  project_management_tool: string;
  project_management_url: string;
  project_description: string;
  project_repo_tool: string;
  project_repo_url: string;
  project_status: string;
}

export interface ProjectData{
  projectName: string;
  projectTech: string[];
  projectStartAt: Date | null;
  projectDeadline: Date | null;
  projectLead: string;
  teamSize: number;
  projectClient: string;
  projectManagementTool: string;
  projectManagementUrl: string;
  projectDescription: string;
  projectRepoTool: string;
  projectRepoUrl: string;
  projectStatus: string;
}

export interface GridValueGetterParams<V = any, R = any> {
  field: string;
  id: GridRowId;
  row: R;
  colDef: GridColDef;
  value: V;
  api: GridApi;
  getValue: (id: GridRowId, field: string) => GridKeyValue;
}
export interface AuthContextTypeData {
  fname: string;
  lname: string;
  phone: string;
  email: string;
  gender: string;
}
export interface AuthGuardProps {
  children: React.ReactNode;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface FormValues {
  password: string;
  confirmPassword: string;
}

export interface AddUserData {
  email: string;
  name: string;
  mobileNumber: string;
  password: string;
  cnfPassword: string;
  roleId: number;
}

export interface ButtonProps {
  text: string;
  type: "submit" | "button" | "reset" | undefined;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  fullWidth?: boolean;
}

export interface ErrorMessageProps {
  text?: string | undefined;
}

export interface InputProps extends Omit<TextFieldProps, 'name' | 'value' | 'error'> {
  label?: string;
  placeholder?: string;
  type?: string;
  name: string;
  value?: string;
  register?: UseFormRegister<any> | null;
  error?: { message?: string } | null;
  className?: string;
  fullWidth?: boolean;
}

export interface SearchInputProps {
  sortBy: string;
  sortOrder: string
  setUserData: any,
  input: string,
  setInput: any,
  recordsPerPage: number,
  page: number,
  setPage: any,
  setTotalUsers: any
}

export interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_number: string;
  user_created_at: string;
}

export interface UserListProps {
  user: User;
  handleDelete: (id: number) => void;
}

export interface useUserInterface {
  setUserData: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UserDetailsInterface {
  user_name: string,
  user_email: string,
  user_number: string,
  user_created_at: string
}

export interface PaginationProps {
  pageProp: number;
  goAhead: () => void;
  goBack: () => void;
  page : number
  totalPages: number
}

export interface EditedUserData {
  user_name: string,
  user_email: string,
  user_number: string,
}

export interface EditFormData {
  name: string,
  email: string,
  number: string,
  roleId: number
}

export interface AllEmailTemplateData {
  et_id: string,
  et_slug: string,
  et_title: string
}

export interface EmailTemplateData {
  et_id: string,
  et_slug: string,
  et_title: string,
  et_content: string,
  et_subject: string,
}

export interface UserStateData {
  id?: number,
  role_id?: number
}

export interface UserStateDataTwo{
  user_email: string,
  user_id: number,
  user_role_id: number
}