import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Link from 'next/link';
const imagePath = process.env.NEXT_PUBLIC_ASSETS;
import { RecipeType } from '../app/types/recipes-types';

export default function Recipe({ data }: { data: RecipeType }) {
  return (
    <ImageListItem key={data.id} sx={{ height: 500 + 'px' }}>
      <img
        src={`${imagePath}/${data.image}?w=248&fit=crop&auto=format`}
        srcSet={`${imagePath}/${data.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={data.name}
      />
      <ImageListItemBar
        title={`${data.name}`}
        subtitle={`${data.area.name} - ${data.category.name}`}
        actionIcon={
          <Link href={`recipe/${data.slug}`}>
            <IconButton
              sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
              aria-label={`See more ${data.name}`}
            >
              <InfoIcon />
            </IconButton>
          </Link>
        }
      />
    </ImageListItem>
  );
}
