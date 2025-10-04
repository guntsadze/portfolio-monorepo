import { JSX } from "react";

type TtabItems = {
  label: string;
  id: string | number;
  defaultActive?: boolean;
  tabItem: JSX.Element;
};

type TuserDetails = {
  emailOrPhone: string;
  imageUrl: string | null;
  isBlocked: boolean;
  name: string;
  userId: string;
  UserPermissionJson: string;
};

export type CompanyLogoType = {
  logo: string;
  companyName: string;
  email: string;
  phone: string;
};

export type CompanyMenuType = {
  id: string;
  module: string;
  parentName: string;
  displayName: string;
  icon: string;
  url: string;
};

export type DynamicDataType = {
  [key: string]: string | number | boolean;
};

export type DynamicData = {
  [key: string]: string | undefined;
};

export type ColumnTypes = {
  field: string;
  headerText?: string;
  width?: number;
  headerTemplate?: (props: any) => React.ReactNode;
};

export type PermissionType = {
  m: number;
  ro: boolean;
};

export type SchemaType = { field: string; validations: string[] };
