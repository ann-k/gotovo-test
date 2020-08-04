import fb from 'firebase';

type FieldRef = fb.firestore.DocumentReference;

export interface Category {
  id: string;
  kind: string;
  title: string;
  description?: string;
  order: number;
  slider: boolean;
  active: boolean;
  hidden: boolean;
}

export enum MealKind {
  drink = 'drink',
  hotDrink = 'hotDrink',
  soup = 'soup',
  salad = 'salad',
  hot = 'hot',
  breakfast = 'breakfast',
  sauce = 'sauce',
  pastry = 'pastry',
  garnish = 'garnish',
}

export interface MealCategory {
  ref: FieldRef;
  order?: number;
}

export enum MealState {
  draft = 'draft',
  elaborating = 'elaborating',
  elaborated = 'elaborated',
  public = 'public',
  archive = 'archive',
}

export const MealStateToRu: {
  [key: string]: string;
  } = {
  draft: 'черновик',
  elaborating: 'в проработке',
  elaborated: 'проработано',
  public: 'паблик',
  archive: 'архив',
};

export type Meal = Partial<{
  id: string;
  title: string;
  categories: MealCategory[];
  measure: Partial<{ unit: string; value: number }>;
  price: number;
  emoji: string;
  uploadcareId: string;
  kind: MealKind;
  state: MealState;
}>;
