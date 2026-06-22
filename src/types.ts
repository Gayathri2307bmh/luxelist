/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
  theme: "royal-lavender" | "midnight-lavender" | "classic-orchid";
  created_at: string;
  current_streak?: number;
  longest_streak?: number;
  last_login_date?: string | null;
}

export interface ShoppingItem {
  id: string;
  user_id: string;
  item_name: string;
  emoji: string;
  category: string;
  quantity: number;
  price: number;
  notes: string | null;
  completed: boolean;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  item_name: string;
  emoji: string;
  target_price: number;
  priority: "High" | "Medium" | "Low";
  created_at: string;
}

export interface Budget {
  user_id: string;
  monthly_budget: number;
  spent_amount: number;
  remaining_amount: number;
}

export interface Achievement {
  id: string;
  user_id: string;
  badge_name: string;
  earned_at: string;
}

export interface Reminder {
  id: string;
  text: string;
  time: string;
  active: boolean;
  badgeEmoji?: string;
}

export interface Suggestion {
  item: string;
  emoji: string;
  reason: string;
  brandTip: string;
}

export interface OptimizationResponse {
  recommendations: {
    originalItem: string;
    alternativeItem: string;
    savings: number;
    comment: string;
  }[];
  totalSavingsPotential: number;
  feedback: string;
}

export interface Recommendation {
  item: string;
  emoji: string;
  category: string;
  description: string;
  estimatedPrice: number;
}
