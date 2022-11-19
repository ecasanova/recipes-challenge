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

export default function Page() {
  const [recipes, setRecipes] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const imagePath = process.env.NEXT_PUBLIC_ASSETS;
  const itemsPerPage = 6;

  const getRecipes = useCallback(async () => {
    return await fetch(
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
        setRecipes([...recipes, ...data.data]);
        setLoading(false);
      });
  }, [page, recipes, setPage, setLastPage, setRecipes, setLoading]);

  useEffect(() => {
    if (isLoading) {
      getRecipes();
    }
  }, [getRecipes, isLoading]);

  return (
    <>
      <FilterBar />
      <InfiniteScroll
        dataLength={recipes.length}
        next={async () => {
          if (page < lastPage) {
            getRecipes();
          }
        }}
        hasMore={page < lastPage}
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
