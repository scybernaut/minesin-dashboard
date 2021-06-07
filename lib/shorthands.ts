export const focusRing = "focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-70";

export const loggedOutReasons = {
  invalid_token: "Your token is invalid.",
  token_expired: "Your session has expired.",
};

export type LoggedOutReasonCodes = keyof typeof loggedOutReasons;
