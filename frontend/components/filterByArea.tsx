import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { AreaType } from '../app/types/recipes-types';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

export default function FilterByArea(props: any) {
  const theme = useTheme();
  const [areas, setAreas] = useState<AreaType[]>([]);
  const [selected, setSelected] = useState<AreaType[]>([]);
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
      });
  }, []);

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
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
              <MenuItem key={area.id} value={area.name}>
                {area.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
