'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import InfiniteScroll from 'react-infinite-scroll-component';
import FilterByArea from '../components/filterByArea';
import FilterByCategory from '../components/filterByCategory';
import FilterByIngredient from '../components/filterByIngredient';
import Grid from '@mui/material/Grid';
declare type Fn = () => any;

export default function Page() {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(0);
  const [length, setLength] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const imagePath = process.env.NEXT_PUBLIC_ASSETS;
  const itemsPerPage = 4;

  const getRecipes: Fn = async () => {
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
        setPage((currentPage) => currentPage + 1);
        setLength(data.totalItems);
        console.log(data);
        setRecipes(data.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    getRecipes();
  }, [getRecipes, page]);

  if (isLoading) return <p>Loading...</p>;
  if (!recipes) return <p>No profile data</p>;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs>
          <FilterByArea />
        </Grid>
        <Grid item xs={6}>
          <FilterByCategory />
        </Grid>
        <Grid item xs>
          <FilterByIngredient />
        </Grid>
      </Grid>
      <ImageList>
        <ImageListItem key="Subheader" cols={2}>
          <ListSubheader component="div">Recomended Recipes:</ListSubheader>
        </ImageListItem>
        <InfiniteScroll
          dataLength={length}
          next={getRecipes()}
          hasMore={itemsPerPage * page < length}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrolableDiv"
        >
          {recipes.map((recipe: any) => (
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
        </InfiniteScroll>
      </ImageList>
    </>
  );
}
