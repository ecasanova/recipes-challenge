import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingComponent = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8, pb: 8 }}>
      <CircularProgress />
    </Box>
  );
};

export default LoadingComponent;
