'use client';

import React, { useEffect, useState, createContext } from 'react';
import ImageList from '@mui/material/ImageList';
import useMediaQuery from '@mui/material/useMediaQuery';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Recipe from '../components/recipe';
import { RecipeType } from './types/recipes-types';
import FilterBar from '../components/filterBar';

export default function Page() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const itemsPerPage = 9;

  const getMoreData = async () => {
    if (page < lastPage) {
      console.log('Loading more data');
      await setLoading(true);
    }
  };

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
          let newRecipes = [...recipes, ...recipesResult.data];
          setRecipes(newRecipes);
          setLastPage(recipesResult.totalPages);
          setPage(page + 1);
          setLoading(false);
        });
    }
  }, [getMoreData]);

  return (
    <>
      <FilterBar />
      <InfiniteScroll
        dataLength={recipes.length}
        next={getMoreData}
        refreshFunction={getMoreData}
        hasMore={page < lastPage}
        scrollThreshold={'200px'}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8, pb: 8 }}>
            <CircularProgress />
          </Box>
        }
      >
        <ImageList cols={3} gap={15}>
          {recipes.map((recipe: RecipeType) => (
            <Recipe data={recipe}></Recipe>
          ))}
        </ImageList>
      </InfiniteScroll>
    </>
  );
}
