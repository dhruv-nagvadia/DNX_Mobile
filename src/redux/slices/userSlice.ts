import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '../api/auth/types';
import { UserState } from './types';

const initialState: UserState = {
  isLoggedIn: false,
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<AuthUser>) => {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
