export interface RecipeType {
  id: string;
  image: string;
  name: string;
  slug: string;
  category: CategoryType;
  area: AreaType;
  ingredients: IngredientType[];
}
export interface CategoryType {
  id: string;
  name: string;
}
export interface AreaType {
  id: string;
  name: string;
}
export interface IngredientType {
  id: string;
  name: string;
}

export interface RecipeSearchOptions {
  id: string;
}

export interface RecipeSearchType {
  areas: RecipeSearchOptions[];
  ingredients: RecipeSearchOptions[];
  categories: RecipeSearchOptions[];
}

export interface RecipeSearchStateType {
  search: RecipeSearchType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSearch: any;
}
