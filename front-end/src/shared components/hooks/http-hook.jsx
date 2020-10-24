import { useState, useCallback, useEffect, useRef } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const activeHttpRequests = useRef([]);
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrll = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrll);
      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: httpAbortCtrll.signal,
        });

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (request) => request !== httpAbortCtrll
        );

        const responseData = await response.json();
        setIsLoading(false);
        if (!response.ok) throw new Error(responseData.message);
        else return responseData;
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "something went wrong please try again");
        throw err;
      }
    },
    []
  );

  const clearError = () => setError(null);

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((request) => request.abort());
    };
  }, []);
  return { isLoading, error, sendRequest, clearError };
};
