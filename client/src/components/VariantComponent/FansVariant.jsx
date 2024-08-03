import { useContext } from "react";
import { PanelContext } from "../../context/PanelContextProvider";

function FansVariant() {
  const { panelSpecs } = useContext(PanelContext);
  return (
    <div className=" w-[158px] h-[158px] flex overflow-hidden">
      <div className="fan-indicators flex flex-col gap-[12px] justify-center items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            style={{ backgroundColor: panelSpecs.droppableColor }}
            className="w-[10px] h-[10px] rounded-full"
          ></div>
        ))}
      </div>
      <div className="fan-indicators flex flex-col justify-center items-end w-[74px]">
        <div
          style={{ borderColor: panelSpecs.droppableColor }}
          className={`w-[50px] h-[50px] rounded-full border-2 flex justify-center items-center p-1`}
        >
          <img className="w-full" src="/ICONS/fans/fan1.png" />
        </div>
      </div>
      <div className="w-[74px] flex flex-col items-center gap-[40px] justify-center">
        <div
          style={{ borderColor: panelSpecs.droppableColor }}
          className="w-[50px] h-[50px] rounded-full border-2 flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={panelSpecs.droppableColor}
            className="size-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        </div>
        <div
          style={{ borderColor: panelSpecs.droppableColor }}
          className="w-[50px] h-[50px] rounded-full border-2 flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={panelSpecs.droppableColor}
            className="size-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default FansVariant;
