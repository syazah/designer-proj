import { useContext, useEffect, useRef } from "react";
import { PanelContext } from "../context/PanelContextProvider";

function DialogBox() {
  const dialogRef = useRef(null);
  const { initialSignIn, setInitialSignIn } = useContext(PanelContext);
  useEffect(() => {
    if (dialogRef.current && initialSignIn === true) {
      dialogRef.current.style.transform = "translateY(0px)";
      dialogRef.current.style.transition = "transform 1s ease-in-out";
    } else if (initialSignIn === false) {
      dialogRef.current.style.transform = "translateY(-500px)";
    }

    const moveUp = setTimeout(() => {
      if (dialogRef.current) {
        dialogRef.current.style.transform = "translateY(-1000px)";
        dialogRef.current.style.transition = "transform 1s ease-in-out";
        setInitialSignIn(false);
      }
    }, 3000);

    return () => clearTimeout(moveUp);
  }, [initialSignIn, setInitialSignIn]);
  return (
    <div
      ref={dialogRef}
      className="signindialog absolute top-20 right-2 w-[250px] h-[60px] bg-zinc-900 rounded-md flex flex-col justify-between z-[20] overflow-hidden -translate-y-[500px]"
    >
      <div className="w-full h-full flex justify-start items-center gap-2 p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="red"
          className="size-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <h1 className="text-white">Sign In Completed</h1>
      </div>
      <div
        style={{ width: "100%", height: "2px" }}
        className="bg-red-600"
      ></div>
    </div>
  );
}

export default DialogBox;
