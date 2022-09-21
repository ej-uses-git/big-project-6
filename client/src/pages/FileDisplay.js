import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getText } from "../utilities/fetch-utils";
const _SERVER_URL = "http://10.0.0.55:3000/users/joen";

function FileDisplay() {
  const navigate = useNavigate();

  const [fileContent, setFileContent] = useState("");
  const { file } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const data = await getText(`${_SERVER_URL}/${file}`);
        if (data instanceof Error) throw data;
        setFileContent(data);
      } catch (error) {
        navigate("/error");
      }
    })();
  }, [file]);

  return (
    <div className="file-display">
      <ul className="info-list">{fileContent}</ul>
    </div>
  );
}

export default FileDisplay;
