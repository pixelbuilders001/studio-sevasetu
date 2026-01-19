export type FormState = {
  message: string;
  errors?: {
    name?: string[];
    mobile?: string[];
    address?: string[];
    landmark?: string[];
    timeSlot?: string[];
    media?: string[];
    problemDescription?: string[];
    _form?: string[];
  };
  success: boolean;
};

export interface Technician {
  id: string;
  full_name: string;
  mobile: string;
  selfie_url: string | null;
  primary_skill: string;
  total_experience: number;
  service_area: string | null;
}
