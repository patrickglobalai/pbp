// create a function to display a error message from firebase, removing FirebaseError:
export const displayErrorMessage = (error: any, message?: string) => {
  return error?.message?.includes("FirebaseError:")
    ? error.message.replace("FirebaseError: ", "")
    : error.message + (message ? `: ${message}` : "");
};

export const isDevelopment = () => {
  return import.meta.env.VITE_ENV === "development";
};

export const DB_URL = {
  users: isDevelopment() ? "users" : "users",
  admins: isDevelopment() ? "admins" : "admins",
  assessment_codes: isDevelopment() ? "assessment_codes" : "assessment_codes",
  coaches: isDevelopment() ? "coaches" : "coaches",
  partners: isDevelopment() ? "partners" : "partners",
  respondents: isDevelopment() ? "respondents" : "respondents",
  results: isDevelopment() ? "results" : "results",
  user_agreements: isDevelopment() ? "user_agreements" : "user_agreements",
};
