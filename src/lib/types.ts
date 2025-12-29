export type FormState = {
  message: string;
  errors?: {
    name?: string[];
    mobile?: string[];
    address?: string[];
    landmark?: string[];
    timeSlot?: string[];
    media?: string[];
    _form?: string[];
  };
  success: boolean;
};
