import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function useClickout(setter) {
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
    navigate("../");
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
