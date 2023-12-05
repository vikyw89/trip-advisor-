import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { emptySplitApi } from './emptySplitApi'
import { rtkQueryErrorLogger } from './middleware'

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
  },
  // Adding the emptySplitApi middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck:false}).concat(emptySplitApi.middleware).concat(rtkQueryErrorLogger),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)