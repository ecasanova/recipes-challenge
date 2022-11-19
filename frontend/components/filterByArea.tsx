import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { AreaType, RecipeSearchStateType } from '../app/types/recipes-types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const FilterByArea = ({ search, setSearch }: RecipeSearchStateType) => {
  const [areas, setAreas] = useState<AreaType[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API}/recipe/getAreas`, {
      next: { revalidate: 600 },
    })
      .then((response) => response.json())
      .then((data) => {
        setAreas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setAreas([]);
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
    const selectedAreas = selectedValues.map((id: string) => ({ id }));
    const newSearch = {
      areas: selectedAreas,
      ingredients: search.ingredients || [],
      categories: search.categories || [],
    };
    //console.log(selectedAreas);
    setSearch(newSearch);
  };

  return (
    <div>
      <FormControl sx={{ m: 0, minWidth: '100%', maxWidth: '100%' }}>
        <InputLabel id="multiple-area-label">Region / Area</InputLabel>
        <Select
          labelId="multiple-area-label"
          id="multiple-area"
          multiple
          value={selected}
          onChange={handleChange}
          input={<OutlinedInput label="Region / Area" />}
          MenuProps={MenuProps}
        >
          {!isLoading &&
            areas.map((area) => (
              <MenuItem key={area.id} value={area.id}>
                {area.name}
              </MenuItem>
            ))}
          {areas.length === 0 && <MenuItem>No areas found</MenuItem>}
        </Select>
      </FormControl>
    </div>
  );
};
export default FilterByArea;
