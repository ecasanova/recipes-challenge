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
