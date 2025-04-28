import { configureStore } from '@reduxjs/toolkit';

import authSlice from './slices/authSlice';
import productsSlice from "./slices/productSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        products: productsSlice,

        // Add other slices here
    } 
    // slice reducers will be added here
});

export default store;
