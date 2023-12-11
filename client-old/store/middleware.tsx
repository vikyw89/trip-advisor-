
import {
  isRejectedWithValue,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // @ts-ignore
    const endpointName = action?.meta?.arg?.endpointName;

    if (
      isFulfilled(action) ||
      isRejected(action) ||
      isRejectedWithValue(action)
    ) {
      toast.remove("loading");
    }

    if (isFulfilled(action)) {
      switch (endpointName) {
        default: {
          console.log("🚀 ~ file: middleware.tsx:28 ~ action:", action)
          // toast.success("",{icon:"🐧"})
        }
      }
    }
    if (isPending(action)) {
      switch (endpointName) {
        default: {
          console.log("🚀 ~ file: middleware.tsx:36 ~ action:", action)
          toast.loading("Loading", { id: "loading" });
        }
      }
    }
    if (isRejectedWithValue(action)) {
      switch (endpointName) {
        default:{
          console.log("🚀 ~ file: middleware.tsx:86 ~ action:", action)
          // @ts-ignore
          toast.error(action.payload.message, { id: "error" });
        }
      }
    } else if (isRejected(action)) {
      console.log("🚀 ~ file: middleware.tsx:88 ~ action:", action)
    }
    return next(action);
  };
