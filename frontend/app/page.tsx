'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ImageList from '@mui/material/ImageList';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { RecipeType } from './types/recipes-types';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Link from 'next/link';
import Image from 'next/image';
const imagePath = process.env.NEXT_PUBLIC_ASSETS;

export default function Page() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const itemsPerPage = 9;

  const getMoreData = useCallback(() => {
    if (page < lastPage) {
      console.log('Loading more data');
      setLoading(true);
    }
  }, [setLoading, lastPage, page]);

  useEffect(() => {
    if (isLoading) {
      fetch(
        `${process.env.NEXT_PUBLIC_API}/recipe/getAll?page=${page}&limit=${itemsPerPage}`,
        {
          next: { revalidate: 600 },
          method: 'POST',
          body: '{}',
        }
      )
        .then((response) => response.json())
        .then((recipesResult) => {
          const newRecipes = [...recipes, ...recipesResult.data];
          setRecipes(newRecipes);
          setLastPage(recipesResult.totalPages);
          setPage(page + 1);
          setLoading(false);
        });
    }
  }, [getMoreData, isLoading, page, recipes]);

  return (
    <>
      <ImageList cols={3} gap={15}>
        {recipes.map((recipe: RecipeType) => (
          <ImageListItem key={recipe.id} sx={{ height: 500 + 'px' }}>
            <Image
              src={`${imagePath}/${recipe.image}?w=248&fit=crop&auto=format`}
              alt={recipe.name}
            ></Image>
            <ImageListItemBar
              title={`${recipe.name}`}
              subtitle={`${recipe.area.name} - ${recipe.category.name}`}
              actionIcon={
                <Link href={`recipe/${recipe.slug}`}>
                  <IconButton
                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`See more ${recipe.name}`}
                  >
                    <InfoIcon />
                  </IconButton>
                </Link>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
