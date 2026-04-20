export type MealType = 'Breakfast' | 'Snacks' | 'Lunch' | 'Dinner';

export interface DayPlan {
  date: string;
  Breakfast?: string;
  Snacks?: string;
  Lunch?: string;
  Dinner?: string;
  [key: string]: string | undefined;
}

export interface Dish {
  Dish_Name: string;
  Meal_Type: string;
  Veg_NonVeg: string;
  Priority?: string;
}

export interface GroceryItem {
  Ingredient: string;
  Current_Qty: number;
  Reorder_Level: number;
  Unit: string;
}

export type Screen = 'home' | 'dishes' | 'grocery' | 'settings';
