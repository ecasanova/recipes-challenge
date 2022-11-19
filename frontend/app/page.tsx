'use client';

import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingComponent from '../components/loadingComponent';
import FilterBar from '../components/filterBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RecipeSearchType, RecipeType } from '../app/types/recipes-types';

const searchInitialState: RecipeSearchType = {
  categories: [],
  areas: [],
  ingredients: [],
};

export default function Page() {
  const [recipes, setRecipes] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchInitialState);
  const imagePath = process.env.NEXT_PUBLIC_ASSETS;
  const itemsPerPage = 6;

  const getRecipes = useCallback(
    async (search: RecipeSearchType, page: number, recipes: string[]) => {
      return await fetch(
        `${process.env.NEXT_PUBLIC_API}/recipe/getAll?page=${page}&limit=${itemsPerPage}`,
        {
          next: { revalidate: 600 },
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(search),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setLastPage(data.totalPages);
          setPage(page + 1);
          setTotalItems(data.totalItems);
          const newRecipes = recipes.concat(data.data);
          setRecipes(newRecipes);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    []
  );

  const updateSearch = useCallback(
    async (newSearch: RecipeSearchType) => {
      console.log('Search:', newSearch);
      setSearch(newSearch);
      setLoading(true);
      setRecipes([]);
      setTotalItems(0);
      setPage(0);
      setLastPage(0);
      await getRecipes(newSearch, 0, []);
    },
    [getRecipes]
  );

  useEffect(() => {
    if (isLoading) {
      getRecipes(search, page, recipes);
    }
  }, [getRecipes, page, isLoading, recipes, search]);

  return (
    <>
      <FilterBar setSearch={updateSearch} search={search} />
      <Typography variant="h6" component="h6" sx={{ mt: 2, mb: 2 }}>
        Found {totalItems} recipes:
      </Typography>
      <InfiniteScroll
        dataLength={itemsPerPage * page}
        next={async () => {
          if (page < lastPage) {
            setLoading(true);
          }
        }}
        hasMore={page < lastPage}
        endMessage={
          <Box>
            {page == lastPage && page > 0 ? (
              <Typography variant="h6" align="center" sx={{ mt: 5, mb: 5 }}>
                Thats all folks!
              </Typography>
            ) : (
              <Typography variant="h6" align="center" sx={{ mt: 5, mb: 5 }}>
                No recipes to show, change your filters!
              </Typography>
            )}
          </Box>
        }
        loader={<LoadingComponent />}
      >
        <ImageList cols={3} gap={15}>
          {recipes.map((recipe: any) => (
            <ImageListItem key={recipe.id}>
              <img
                src={`${imagePath}/${recipe?.image}?w=248&fit=crop&auto=format`}
                layout="responsive"
                width={248}
                height={248}
                quality={80}
                alt={recipe.name}
                loading="lazy"
              />
              <ImageListItemBar
                title={`${recipe.name}`}
                subtitle={`${recipe.area?.name} - ${recipe.category?.name}`}
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
      </InfiniteScroll>
    </>
  );
}
