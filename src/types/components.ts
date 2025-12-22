export interface PhoneInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  label?: string;
  error?: boolean;
  touched?: boolean;
  errorMessage?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export interface OutlinedInputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: boolean;
  touched?: boolean;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
  className?: string;
}

export interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  error?: string;
  disabled?: boolean;
}

export interface AuthWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export interface AuthSwitchLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

export interface SocialLoginButtonProps {
  provider: "google" | "apple" | "facebook";
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface CompaniesFiltersProps {
  onFilterChange: (filters: Record<string, unknown>) => void;
}

export interface CompaniesGridProps {
  companies: Array<{
    id: string;
    name: string;
    [key: string]: unknown;
  }>;
  onCompanyClick?: (id: string) => void;
}

export interface CountriesFiltersProps {
  onFilterChange: (filters: Record<string, unknown>) => void;
}

export interface CountriesGridProps {
  countries: Array<{
    id: string;
    name: string;
    [key: string]: unknown;
  }>;
  onCountryClick?: (id: string) => void;
}

export interface UsersTableProps {
  users: Array<{
    id: string;
    [key: string]: unknown;
  }>;
  onUserClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface UsersFiltersProps {
  onFilterChange: (filters: Record<string, unknown>) => void;
}

export interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
  onSave?: () => void;
}

export interface ShopsGridProps {
  shops: Array<{
    id: string;
    name: string;
    [key: string]: unknown;
  }>;
  onShopClick?: (id: string) => void;
}

export interface ShopsFiltersProps {
  onFilterChange: (filters: Record<string, unknown>) => void;
}

export interface ProductsFiltersProps {
  onFilterChange: (filters: Record<string, unknown>) => void;
}

export interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  productId?: string;
  onSave?: () => void;
}

