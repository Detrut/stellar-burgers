import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Params, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredientState } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { list } = useSelector(getIngredientState);
  const { id } = useParams<Params>();

  const ingredientData = list.find((i) => {
    if (i._id === id) {
      return i;
    }
  });

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
