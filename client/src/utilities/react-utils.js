import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useClickout() {
  const navigate = useNavigate();
  const handleClick = useCallback((e) => {
    if (e.target.tagName === "BODY") navigate("../");
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
}

export { useClickout };
