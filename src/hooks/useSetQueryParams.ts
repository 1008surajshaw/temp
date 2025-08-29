import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import _ from "lodash";
import { debounce } from "lodash";

export default function useSetQueryParams() {
  const navigate = useNavigate();
  const location = useLocation();

  const updateQueryParams = useCallback(
    debounce((params: any) => {
      const searchParams = new URLSearchParams();

      for (const [key, value] of Object.entries(params)) {
        if (_.isEmpty(value) && typeof value !== "number") {
          continue; // don't add empty filters
        } else if (Array.isArray(value)) {
          // Remove previous values for this key
          searchParams.delete(key);
          value.forEach((v) => {
            if (!_.isEmpty(v)) searchParams.append(key, v);
          });
        } else {
          searchParams.set(key, String(value));
        }
      }

      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }, 500),
    [navigate, location.pathname]
  );

  return updateQueryParams;
}
