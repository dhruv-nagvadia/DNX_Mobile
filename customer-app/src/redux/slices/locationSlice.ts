import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerLocation } from '@/utils/location';

interface LocationState {
  current: CustomerLocation | null;
}

const initialState: LocationState = { current: null };

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<CustomerLocation>) => {
      state.current = action.payload;
    },
    clearLocation: (state) => {
      state.current = null;
    },
  },
});

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
