import FilterByArea from './filterByArea';
import FilterByCategory from './filterByCategory';
import FilterByIngredient from './filterByIngredient';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

const FilterBar = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h5" sx={{ mt: 4, mb: 4 }}>
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
          <Grid
            item
            xs={12}
            sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}
          >
            <Button variant="contained" startIcon={<SearchIcon />}>
              Get my recipe
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default FilterBar;
