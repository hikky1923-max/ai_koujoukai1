export type Plan = {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  budget_yen: number | null;
  description: string | null;
  itinerary: string | null;
  created_at: string;
  profiles: { display_name: string } | null;
  likes: { user_id: string }[];
};

export const PLAN_SELECT = "*, profiles!plans_user_id_fkey(display_name), likes(user_id)";
