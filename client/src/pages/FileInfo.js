import { useState, useEffect } from "react";
import { useNavigate, useParams, useResolvedPath } from "react-router-dom";
import { getData } from "../utilities/fetch-utils";
import { getURL } from "../utilities/folder-utils";
import { useClickout } from "../utilities/react-utils";

function FileInfo() {
  const navigate = useNavigate();
  const { pathname } = useResolvedPath();

  const [fileInfo, setFileInfo] = useState({});
  const { filename } = useParams();

  let returnPath = pathname.split("/");
  returnPath = returnPath.slice(0, returnPath.indexOf(`/info`) - 1).join("/");
  const vanish = useClickout(returnPath);

  useEffect(() => {
    (async () => {
      try {
        const data = await getData(`${getURL(pathname)}`, "json");
        if (data instanceof Error) throw data;
        setFileInfo(data);
      } catch (error) {
        navigate("/error");
      }
    })();
  }, [filename]);

  return (
    <div className={"file-info" + (vanish ? " disappear" : "")}>
      <ul className="info-list">
        {Object.keys(fileInfo).map((key) => (
          <div className="pair" key={key + "-" + fileInfo[key]}>
            <div className="key">{key}:</div>
            <div className="value">{fileInfo[key]}</div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default FileInfo;
