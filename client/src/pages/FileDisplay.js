import { useState, useEffect } from "react";
import { useNavigate, useParams, useResolvedPath } from "react-router-dom";
import { getData } from "../utilities/fetch-utils";
import { getURL } from "../utilities/folder-utils";
import { useClickout } from "../utilities/react-utils";

function FileDisplay() {
  const navigate = useNavigate();
  const { pathname } = useResolvedPath();
  const filename = pathname.split("/")[pathname.split("/").length - 1];

  const [fileContent, setFileContent] = useState("");

  const vanish = useClickout("../");

  useEffect(() => {
    (async () => {
      try {
        const fileType = filename.split(".")[1];
        const data = await getData(`${getURL(pathname)}`, fileType);
        if (data instanceof Error) throw data;
        setFileContent(data);
      } catch (error) {
        navigate("/error");
      }
    })();
  }, [filename]);

  return (
    <div className={"file-display" + (vanish ? " disappear" : "")}>
      <ul className="info-list">
        {typeof fileContent === "string"
          ? fileContent
          : JSON.stringify(fileContent)}
      </ul>
    </div>
  );
}

export default FileDisplay;
