import { DayPlan, Dish, GroceryItem, MealType } from '../types';

const BASE_URL =
  'https://script.google.com/macros/s/AKfycbwvmZpHHyvX8oo31xnRK5RNvNrMm2ZbSFTYCrJzTX-sDKrgGly1fqEm1FUUWtBFHCQ/exec';

async function getRequest<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { redirect: 'follow' });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function postRequest(params: Record<string, string>): Promise<void> {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  await fetch(url.toString(), {
    method: 'POST',
    mode: 'no-cors',
    redirect: 'follow',
  });
}

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

export async function overrideMeal(
  date: string,
  mealType: MealType,
  dishName: string
): Promise<void> {
  await postRequest({ action: 'overrideMeal', date, mealType, dishName });
}

export async function updateGrocery(ingredient: string, qty: string): Promise<void> {
  await postRequest({ action: 'updateGrocery', ingredient, qty });
}

export async function triggerPlan(): Promise<void> {
  await postRequest({ action: 'triggerPlan' });
}
