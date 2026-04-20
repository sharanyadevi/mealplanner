import { DayPlan, Dish, GroceryItem, MealType } from '../types';

const BASE_URL =
  'https://script.google.com/macros/s/AKfycbwvmZpHHyvX8oo31xnRK5RNvNrMm2ZbSFTYCrJzTX-sDKrgGly1fqEm1FUUWtBFHCQ/exec';

// ── GET request ───────────────────────────────────────────
async function getRequest<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { redirect: 'follow' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

// ── POST request (uses GET under the hood for Apps Script) ─
async function postRequest(params: Record<string, string>): Promise<{ success?: boolean; status?: string; error?: string }> {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { redirect: 'follow' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

// ── Fetch Weekly Plan ─────────────────────────────────────
export async function fetchWeeklyPlan(): Promise<DayPlan[]> {
  try {
    const data = await getRequest<DayPlan[] | { data: DayPlan[] }>({
      action: 'getWeeklyPlan',
    });
    return Array.isArray(data) ? data : (data as { data: DayPlan[] }).data ?? [];
  } catch {
    throw new Error('Failed to load weekly plan');
  }
}

// ── Fetch Dishes ──────────────────────────────────────────
export async function fetchDishes(): Promise<Dish[]> {
  try {
    const data = await getRequest<Dish[] | { data: Dish[] }>({
      action: 'getDishes',
    });
    return Array.isArray(data) ? data : (data as { data: Dish[] }).data ?? [];
  } catch {
    throw new Error('Failed to load dishes');
  }
}

// ── Fetch Grocery ─────────────────────────────────────────
export async function fetchGrocery(): Promise<GroceryItem[]> {
  try {
    const data = await getRequest<GroceryItem[] | { data: GroceryItem[] }>({
      action: 'getGrocery',
    });
    return Array.isArray(data) ? data : (data as { data: GroceryItem[] }).data ?? [];
  } catch {
    throw new Error('Failed to load grocery list');
  }
}

// ── Override Meal ─────────────────────────────────────────
export async function overrideMeal(
  date: string,
  mealType: MealType,
  dishName: string
): Promise<void> {
  const result = await postRequest({ action: 'overrideMeal', date, mealType, dishName });
  if (result.error) throw new Error(result.error);
}

// ── Update Grocery ────────────────────────────────────────
export async function updateGrocery(ingredient: string, qty: string): Promise<void> {
  const result = await postRequest({ action: 'updateGrocery', ingredient, qty });
  if (result.error) throw new Error(result.error);
}

// ── Add New Dish ──────────────────────────────────────────
export async function addDish(
  dishName: string,
  mealType: string,
  vegNonVeg: string,
  ingredients: string,
  frequency: string,
  priority: string
): Promise<void> {
  const result = await postRequest({
    action: 'addDish',
    dishName,
    mealType,
    vegNonVeg,
    ingredients,
    frequency,
    priority,
  });
  if (result.error) throw new Error(result.error);
}

// ── Trigger Weekly Plan ───────────────────────────────────
export async function triggerPlan(): Promise<void> {
  const result = await postRequest({ action: 'triggerPlan' });
  if (result.error) throw new Error(result.error);
}