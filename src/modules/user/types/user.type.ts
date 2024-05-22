export type UserType = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  password: string;
  salt: string;
  pin: string;
  image_url: string;
  referral_code: string;
  user_name: string;
  phone_number: string;
  is_verified: boolean;
  has_pin: boolean;
  dob: Date;
  gender: string;
  bvn: string;
  address: string;
  is_bvn_verified: boolean;
  is_id_verified: boolean;
  profile_completed: boolean;
  biometric_enabled: boolean;
  created_at: Date;
  updated_at: Date;
};

export type BankType = {
  id: string;
  user_id: string;
  bank_name: string;
  account_name: string;
  account_number: number;
  bank_code: string;
};
