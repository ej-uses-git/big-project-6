import { useClickout } from "../utilities/react-utils";

function DeleteConfirm(props) {
  const vanish = useClickout("", props.onClickout);

  return (
    <div
      className={"delete-confirm" + (vanish ? " disappear" : "")}
      id="delete-confirm"
    >
      <h3>
        Delete this file?
        <br />
        This action cannot be undone!
      </h3>
      <button className="yes btn" onClick={props.confirm}>
        YES
      </button>
      <button className="no btn" onClick={props.deny}>
        NO
      </button>
    </div>
  );
}

export default DeleteConfirm;
