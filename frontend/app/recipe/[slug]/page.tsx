import React from 'react';

async function getRecipe(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/recipe/getBySlug?=${slug}`,
    {
      next: { revalidate: 600 },
    }
  );
  return res.json();
}

export default async function RecipeWithSlug({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const recipe = await getRecipe(slug);
  return (
    <>
      <h1>Recipe</h1>
      <p>Detalle de receta {slug}</p>
    </>
  );
}
