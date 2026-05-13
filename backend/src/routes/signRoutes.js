import { Router } from 'express';
import {
  listSourcesController,
  lookupSignsController,
  trendingSignsController
} from '../controllers/signController.js';

const signRoutes = Router();

signRoutes.get('/sources', listSourcesController);
signRoutes.get('/trending', trendingSignsController);
signRoutes.get('/lookup', lookupSignsController);

export default signRoutes;
