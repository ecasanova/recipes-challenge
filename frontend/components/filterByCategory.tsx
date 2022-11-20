import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';

import {
  CategoryType,
  RecipeSearchStateType,
} from '../app/types/recipes-types';

const FilterByCategory = ({ search, setSearch }: RecipeSearchStateType) => {
  const [category, setCategory] = useState<CategoryType[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/recipe/getCategories`, {
      next: { revalidate: 600 },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategory(data);
      })
      .catch((error) => {
        console.log(error);
        setCategory([]);
      });
  }, []);

  const defaultProps = {
    options: category,
    getOptionLabel: (option: CategoryType) => option.name,
  };

  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: '100%', maxWidth: '100%' }}>
        <Autocomplete
          {...defaultProps}
          clearOnEscape
          multiple
          id="tags-standard"
          options={category}
          onChange={(event: any, newValue: any | null) => {
            const newSearch = {
              areas: search.areas,
              categories: newValue,
              ingredients: search.ingredients,
            };
            setSearch(newSearch);
          }}
          defaultValue={[]}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />
      </FormControl>
    </div>
  );
};
export default FilterByCategory;
