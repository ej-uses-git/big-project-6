import { useState } from "react";
import { useClickout } from "../utilities/react-utils";

function NewName(props) {
  const vanish = useClickout(props.onClickout);

  const [newName, setNewName] = useState("");

  return (
    <div className={"new-name" + (vanish ? " disappear" : "")} id="new-name">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit(newName);
        }}
      >
        <label htmlFor="new-name-input">Enter a new name:</label>
        <input
          type="text"
          name="newName"
          id="new-name-input"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
          }}
        />
        <button type="submit">CONFIRM</button>
      </form>
    </div>
  );
}

export default NewName;
