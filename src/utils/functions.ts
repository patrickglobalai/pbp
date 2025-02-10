// create a function to display a error message from firebase, removing FirebaseError:
export const displayErrorMessage = (error: any, message?: string) => {
  return (
    error?.message?.includes("FirebaseError:")
      ? error.message.replace("FirebaseError: ", "")
      : error.message + (message ? `: ${message}` : "")
  );
};
