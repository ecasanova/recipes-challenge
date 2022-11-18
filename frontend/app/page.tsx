'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

export default function Page() {
  const [recipes, setRecipes] = useState();
  const [isLoading, setLoading] = useState(false);
  const imagePath = process.env.NEXT_PUBLIC_ASSETS;

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API}/recipe/getAll?page=0&limit=10`, {
      next: { revalidate: 600 },
      method: 'POST',
      body: '{}',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!recipes) return <p>No profile data</p>;

  return (
    <ImageList>
      <ImageListItem key="Subheader" cols={2}>
        <ListSubheader component="div">Recomended Recipes:</ListSubheader>
      </ImageListItem>
      {recipes.data.map((recipe: any) => (
        <Link href={`recipe/${recipe.slug}`}>
          <ImageListItem key={recipe.image}>
            <img
              src={`${imagePath}/${recipe.image}?w=248&fit=crop&auto=format`}
              srcSet={`${imagePath}/${recipe.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={recipe.name}
              loading="lazy"
            />
            <ImageListItemBar
              title={recipe.name}
              subtitle={recipe.category.name}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`See more ${recipe.name}`}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        </Link>
      ))}
    </ImageList>
  );
}
