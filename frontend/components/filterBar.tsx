import FilterByArea from './filterByArea';
import FilterByCategory from './filterByCategory';
import FilterByIngredient from './filterByIngredient';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const FilterBar = () => {
  return (
    <Grid container spacing={0}>
      <Grid item style={{ backgroundColor: 'yellow' }}>
        <Typography variant="h5" component="h5" sx={{ mt: 2, mb: 2 }}>
          Choose your preferences and we select the best recipe for you:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FilterByCategory />
          </Grid>
          <Grid item xs={4}>
            <FilterByIngredient />
          </Grid>
          <Grid item xs={4}>
            <FilterByArea />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default FilterBar;
