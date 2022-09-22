import { useEffect, useState } from "react";
import { useResolvedPath } from "react-router-dom";
import FileDisplay from "../pages/FileDisplay";
import Folder from "../pages/Folder";

function NavigateDatatype() {
  const [displayingFolder, setDisplayingFolder] = useState(true);
  const { pathname } = useResolvedPath();

  useEffect(() => {
    const afterPeriod = pathname.split(".");
    console.log(afterPeriod);
    if (afterPeriod.length > 1) setDisplayingFolder(false);
  }, []);

  return <>{displayingFolder ? <Folder /> : <FileDisplay />}</>;
}

export default NavigateDatatype;
