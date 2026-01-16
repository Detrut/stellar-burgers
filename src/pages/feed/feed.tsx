import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../services/store';
import {
  selectFeedOrders,
  selectFeedLoading,
  fetchFeeds
} from '../../services/slices/feedSlice';
import { ingredientList } from '../../services/slices/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const ingredients = useSelector(ingredientList);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!hasLoaded.current && !isLoading) {
      hasLoaded.current = true;
      dispatch(fetchFeeds());
    }
  }, []);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading || !ingredients.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
