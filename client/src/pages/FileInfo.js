import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getData } from "../utilities/fetch-utils";
import { SERVER_URL } from "../utilities/folder-utils";
import { useClickout } from "../utilities/react-utils";

function FileInfo() {
  const navigate = useNavigate();

  const [fileInfo, setFileInfo] = useState({});
  const { file } = useParams();

  const vanish = useClickout();

  useEffect(() => {
    (async () => {
      try {
        const data = await getData(`${SERVER_URL}/info/${file}`, "json");
        if (data instanceof Error) throw data;
        setFileInfo(data);
      } catch (error) {
        navigate("/error");
      }
    })();
  }, [file]);

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
