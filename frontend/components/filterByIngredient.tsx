import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import {
  IngredientType,
  RecipeSearchStateType,
} from '../app/types/recipes-types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    setSelected(selectedValues);
    const selectedIngredients = selectedValues.map((id: string) => ({ id }));
    const newSearch = {
      areas: search.areas || [],
      ingredients: selectedIngredients,
      categories: search.categories || [],
    };
    //console.log(selectedIngredients);
    setSearch(newSearch);
  };

  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: '100%', maxWidth: '100%' }}>
        <InputLabel id="multiple-ingredient-label">Ingredient</InputLabel>
        <Select
          labelId="multiple-ingredient-label"
          id="multiple-ingredient"
          multiple
          value={selected}
          onChange={handleChange}
          input={<OutlinedInput label="Ingredient" />}
          MenuProps={MenuProps}
        >
          {!isLoading &&
            ingredients.map((ingredient) => (
              <MenuItem key={ingredient.id} value={ingredient.id}>
                {ingredient.name}
              </MenuItem>
            ))}
          {ingredients.length === 0 && (
            <MenuItem>No ingredients found</MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  );
};
export default FilterByIngredient;
