import React from 'react';

async function getRecipe(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/recipe/getBySlug/${slug}`,
    {
      next: { revalidate: 600 },
    }
  );
  return res.json();
}

export default async function RecipeWithSlug({
  params: { slug },
}: {
  params: { slug: any };
}) {
  const recipe = await getRecipe(slug);
  console.log(recipe);
  return (
    <>
      <h1>{recipe.name}</h1>
      <h2>{recipe.area.name}</h2>
      <h3>{recipe.category.name}</h3>
      <p>Detalle de receta {recipe.description}</p>
    </>
  );
}
