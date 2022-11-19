'use client';

import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import InfiniteScroll from 'react-infinite-scroll-component';
import FilterByArea from '../components/filterByArea';
import FilterByCategory from '../components/filterByCategory';
import FilterByIngredient from '../components/filterByIngredient';
import Typography from '@mui/material/Typography';
import LoadingComponent from '../components/loadingComponent';
import Image from 'next/image';

export default function Page() {
  const [recipes, setRecipes] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const imagePath = process.env.NEXT_PUBLIC_ASSETS;
  const itemsPerPage = 3;
  const matches = useMediaQuery('(min-width:600px)');

  const getRecipes = useCallback(async () => {
    fetch(
      `${process.env.NEXT_PUBLIC_API}/recipe/getAll?page=${page}&limit=${itemsPerPage}`,
      {
        next: { revalidate: 600 },
        method: 'POST',
        body: '{}',
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setPage(page + 1);
        setLastPage(data.totalPages);
        const newRecipes = [...recipes, ...data.data];
        setRecipes(newRecipes);
        setLoading(false);
      });
  }, [page, recipes]);

  useEffect(() => {
    setLoading(true);
    getRecipes();
  }, [
    setLoading,
    setRecipes,
    setPage,
    page,
    getRecipes,
    page,
    recipes,
    setLastPage,
    isLoading,
  ]);

  return (
    <>
      <Typography variant="h5" component="h5" sx={{ mt: 2, mb: 2 }}>
        Choose your preferences and we select the best recipe for you:
      </Typography>
      <ImageList cols={3} gap={15} sx={{ pb: 0, pt: 2 }}>
        <ImageListItem>
          <FilterByCategory />
        </ImageListItem>
        <ImageListItem>
          <FilterByIngredient />
        </ImageListItem>
        <ImageListItem>
          <FilterByArea />
        </ImageListItem>
      </ImageList>
      <InfiniteScroll
        dataLength={1}
        next={() => {
          getRecipes();
        }}
        hasMore={page < lastPage}
        scrollThreshold={'300px'}
        loader={<LoadingComponent />}
      >
        <ImageList cols={3} gap={15}>
          {recipes.map((recipe: any) => (
            <ImageListItem key={recipe.id}>
              <Image
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
