import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';

import {
  IngredientType,
  RecipeSearchStateType,
} from '../app/types/recipes-types';

const FilterByIngredient = ({ search, setSearch }: RecipeSearchStateType) => {
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [selected, setSelected] = useState<IngredientType[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API}/recipe/getIngredients`, {
      next: { revalidate: 600 },
    })
      .then((response) => response.json())
      .then((data) => {
        setIngredients(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIngredients([]);
        setLoading(false);
      });
  }, []);

  const defaultProps = {
    options: ingredients,
    getOptionLabel: (option: IngredientType) => option.name,
  };

  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: '100%', maxWidth: '100%' }}>
        <Autocomplete
          {...defaultProps}
          clearOnEscape
          multiple
          id="tags-standard"
          options={ingredients}
          onChange={(event: any, newValue: IngredientType | null) => {
            const newSearch = {
              areas: search.areas || [],
              ingredients: newValue || [],
              categories: search.categories || [],
            };
            setSearch(newSearch);
          }}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField {...params} label="Ingredients" />
          )}
        />
      </FormControl>
    </div>
  );
};
export default FilterByIngredient;
