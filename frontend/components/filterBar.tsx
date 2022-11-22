import FilterByArea from './filterByArea';
import FilterByCategory from './filterByCategory';
import FilterByIngredient from './filterByIngredient';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { RecipeSearchStateType } from '../app/types/recipes-types';

const FilterBar = ({ search, setSearch }: RecipeSearchStateType) => {
  return (
    <Grid container spacing={0} sx={{ mb: 4 }}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h5" sx={{ mt: 4, mb: 4 }}>
          Choose your preferences and we select the best recipe for you:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FilterByCategory setSearch={setSearch} search={search} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FilterByArea setSearch={setSearch} search={search} />
          </Grid>
          <Grid item xs={12}>
            <FilterByIngredient setSearch={setSearch} search={search} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default FilterBar;
