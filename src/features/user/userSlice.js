import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {}
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {};
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ email, name, password, navigate }, { dispatch, rejectWithValue }) => {
    try {
      if (!email || !name || !password) {
        dispatch(
          showToastMessage({
            message: "모든 필드를 입력해주세요",
            status: "error",
          })
        );
        return rejectWithValue("필드 누락");
      }

      const response = await api.post("/user", { email, name, password });
      // 성공하면? >> 성공했다는 메시지 보여주기 + redirect to login page
      dispatch(
        showToastMessage({ message: "회원가입을 성공했습니다!!", status: "success" })
      );
      navigate("/login");
      return response.data.data;
    } catch (error) {
      // 실패하면? >> 실패 메시지 보여주기 + 에러값 저장하기
      dispatch(
        showToastMessage({
          message: "회원가입에 실패했습니다",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {}
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
