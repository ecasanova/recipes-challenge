import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { CategoryType } from '../app/types/recipes-types';
import { RecipeSearchType } from '../app/types/recipes-types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const FilterByCategory: React.FC<Props> = ({ setSearch, search }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selected, setSelected] = useState<CategoryType[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API}/recipe/getCategories`, {
      next: { revalidate: 600 },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setCategories([]);
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
    const selectedCategories = selectedValues.map((id) => ({ id }));
    const newSearch = {
      areas: search.areas,
      ingredients: search.ingredients,
      categories: selectedCategories,
    };
    //console.log(selectedCategories);
    setSearch(newSearch);
  };

  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: '100%', maxWidth: '100%' }}>
        <InputLabel id="multiple-category-label">Category</InputLabel>
        <Select
          labelId="multiple-category-label"
          id="multiple-category"
          multiple
          value={selected}
          onChange={handleChange}
          input={<OutlinedInput label="Category" />}
          MenuProps={MenuProps}
        >
          {!isLoading &&
            categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          {categories.length === 0 && <MenuItem>No categories found</MenuItem>}
        </Select>
      </FormControl>
    </div>
  );
};
export default FilterByCategory;
