export interface CreateSubscriptionDto {
  user_id: string;
  plan_id: string;
  start_date: Date;
  end_date: Date;
  is_active?: boolean;
}

export interface UpdateSubscriptionDto {
  start_date?: Date;
  end_date?: Date;
  is_active?: boolean;
}

export interface SubscriptionResponseDto {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}