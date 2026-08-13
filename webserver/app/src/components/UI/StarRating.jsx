import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, size = 18, maxStars = 5 }) => (
  <div className='flex gap-1'>
    {Array.from({ length: maxStars }).map((_, i) => (
      <Star 
        key={i} 
        size={size} 
        className={i < Math.ceil(rating) ? 'fill-yellow-400 text-green-500' : 'fill-gray-300 text-gray-300'}
      />
    ))}
  </div>
);