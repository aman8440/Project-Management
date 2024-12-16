import { ReactNode } from "react";
import { LoginSchema } from "../schema";
import { z } from "zod";
import { UseFormRegister } from 'react-hook-form';
import { TextFieldProps } from "@mui/material/TextField";
import { GridApi, GridColDef, GridRowId, GridKeyValue } from "@mui/x-data-grid";

export type SignInData = z.infer<typeof LoginSchema>;

export interface UserData {
  id: number
  fname: string;
  lname: string;
  email: string;
  gender: string;
  phone: string;
  status: string;
  image_name?: string
}
export interface FilterType {
  page: number;
  pageSize: number;
}
export interface LoaderContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface UploadResponse {
  url: string;
}
export interface deleteResponse {
  id: string;
}
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  actions: {
    label: string;
    onClick: () => void;
    color?: string;
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

export interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterDataProp) => void;
  onReset: () => void;
  filters: FilterDataProp;
  setFilters: React.Dispatch<React.SetStateAction<FilterDataProp>>;
}

export interface FilterDataProp{
  projectStartAt: Date | null;
  projectDeadline: Date | null; 
  projectStatus: string;
  projectTech: string[];
}

export interface DynamicFilters {
  [key: string]: string[] | string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface GridValueGetterParams<V = any, R = any> {
  field: string;
  id: GridRowId;
  row: R;
  colDef: GridColDef;
  value: V;
  api: GridApi;
  getValue: (id: GridRowId, field: string) => GridKeyValue;
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
  reset_token: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sx?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startIconPass?: any;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any> | null;
  error?: { message?: string } | null;
  className?: string;
  fullWidth?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputSlotProps?: any;
}
