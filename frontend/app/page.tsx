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
import Image from 'next/image';
import FilterBar from '../components/filterBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RecipeSearchType } from '../app/types/recipes-types';

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

  const getRecipes = useCallback(async () => {
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
        setPage(data.currentPage);
        setLastPage(data.totalPages);
        setRecipes([...data.data]);
        setTotalItems(data.totalItems);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setRecipes([]);
      });
  }, [page, search]);

  const updateSearch = useCallback(
    async (newSearch: RecipeSearchType) => {
      console.log('called use callback updateSearch');
      setPage(0);
      setLastPage(0);
      setTotalItems(0);
      setRecipes([]);
      setSearch(newSearch);
      await getRecipes();
    },
    [getRecipes]
  );

  useEffect(() => {
    if (isLoading) {
      console.log('called use effect');
      getRecipes();
    }
    updateSearch();
  }, [getRecipes, isLoading, setSearch, search, updateSearch]);

  return (
    <>
      <FilterBar setSearch={updateSearch} search={search} />
      <Typography variant="h6" component="h6" sx={{ mt: 2, mb: 2 }}>
        Found {totalItems} recipes:
      </Typography>
      <InfiniteScroll
        dataLength={totalItems}
        next={async () => {
          if (page < lastPage) {
            await getRecipes();
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
                src={`${imagePath}/${recipe.image}?w=248&fit=crop&auto=format`}
                layout="responsive"
                width={248}
                height={248}
                quality={80}
                alt={recipe.name}
              />
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
      </InfiniteScroll>
    </>
  );
}
