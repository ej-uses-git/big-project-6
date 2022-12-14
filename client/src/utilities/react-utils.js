import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function useClickout(returnPath, setter) {
  const navigate = useNavigate();
  const [vanish, setVanish] = useState(false);
  const handleClick = useCallback(async (e) => {
    if (e.target.tagName !== "BODY") return;
    await (() => {
      setVanish(true);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 400);
      });
    })();
    if (!setter) return navigate(returnPath);
    setter(false);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return vanish;
}

export { useClickout };
