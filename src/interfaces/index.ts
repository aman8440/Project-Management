import { ReactNode } from "react";
import { LoginSchema } from "../schema";
import { z } from "zod";
import { UseFormRegister } from 'react-hook-form';
import { TextFieldProps } from "@mui/material/TextField";
import { GridApi, GridColDef, GridRowId, GridKeyValue } from "@mui/x-data-grid";
import { DocumentStatusEnum } from "../swagger/api";

export type SignInData = z.infer<typeof LoginSchema>;

export interface UserData {
  created_at: string,
  email: string,
  first_name: string,
  last_name: string,
  updated_at: string
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
  content: string | ExtractDetailData; 
  actions: {
    label: string;
    onClick: () => void;
    color?: string;
  }[];
}

export interface TemplateProp{
  id:string;
  document_id:string;
  name:string
}

export interface RowData {
  created_at: string;
  document_name: string;
  document_path: string;
  extension: string;
  is_data_published: boolean;
  is_template: boolean;
  is_template_apply: boolean;
  template: TemplateProp | null;
  updated_at: string;
  id:string
  processing_status:string
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

export interface ExtractDetailData{
  created_at?: string | null;
  created_by?: string | null;
  document_name?: string;
  document_path?:string;
  extension?:string;
  id?:string;
  is_data_published?:boolean;
  is_deleted?:boolean;
  is_template?:boolean;
  is_template_apply?:boolean;
  processed_at?: string | null;
  processing_status?:  DocumentStatusEnum | '';
  published_by?: string | null;
  template?: TemplateProp | null | undefined;
  textract_data_path?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
}

export interface FilterState {
  visibleFilter: boolean;
  dependentField: boolean;
  inDependentField: boolean;
  statuses: string[];
  techOptions: string[];
  techSearch: string;
  showStatusField: boolean;
  showTechField: boolean;
  toolSearch: string;
}
export interface ExtractFilterState {
  visibleFilter: boolean;
  selectedStatus: string;
  selectedExtension: string;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
}

export interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterDataProp) => void;
  onReset: () => void;
  filters: FilterDataProp;
  setFilters: React.Dispatch<React.SetStateAction<FilterDataProp>>;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
}

export interface ExtractFilterDataProp{
  processing_status?: DocumentStatusEnum | '';
  extension?: string;
  startDateAt?: Date | null;
  endDateAt?: Date | null; 
}

export interface ExtractFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: ExtractFilterDataProp) => void;
  onReset: () => void;
  filter: ExtractFilterDataProp;
  onRemoveFilter: (filterKey: keyof ExtractFilterState) => void;
  setFilters: React.Dispatch<React.SetStateAction<ExtractFilterDataProp>>;
  filterState: ExtractFilterState;
  setFilterState: React.Dispatch<React.SetStateAction<ExtractFilterState>>;
}

export interface FilterDataProp{
  projectStartAt?: Date | null;
  projectDeadline?: Date | null; 
  projectStatus?: string;
  projectTech?: string[];
  projectManagementTool?: string;
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
