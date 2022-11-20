import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';

import { AreaType, RecipeSearchStateType } from '../app/types/recipes-types';

const FilterByArea = ({ search, setSearch }: RecipeSearchStateType) => {
  const [area, setArea] = useState<AreaType[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/recipe/getAreas`, {
      next: { revalidate: 600 },
    })
      .then((response) => response.json())
      .then((data) => {
        setArea(data);
      })
      .catch((error) => {
        console.log(error);
        setArea([]);
      });
  }, []);

  const defaultProps = {
    options: area,
    getOptionLabel: (option: AreaType) => option.name,
  };

  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: '100%', maxWidth: '100%' }}>
        <Autocomplete
          {...defaultProps}
          clearOnEscape
          multiple
          id="tags-standard"
          options={area}
          onChange={(event: any, newValue: any | null) => {
            const newSearch = {
              areas: newValue,
              categories: search.categories,
              ingredients: search.ingredients,
            };
            setSearch(newSearch);
          }}
          defaultValue={[]}
          renderInput={(params) => <TextField {...params} label="Area" />}
        />
      </FormControl>
    </div>
  );
};
export default FilterByArea;
