/**
 * Utils: Back-end
 */

import { requestApi } from "./api-common"

/**
 * Register a new user
 */
export const userRegister = async (email, password) => {
  return await requestApi("/users/register", "POST", { email, password });
};

/**
 * Login a new user
 */
export const userLogin = async (email, password) => {
  return await requestApi("/users/login", "POST", { email, password });
};

/**
 * userGet
 */
export const userGet = async (token) => {
  return await requestApi("/user", "POST", null, {
    Authorization: `Bearer ${token}`,
  });
};

