import { Link } from "react-router-dom";
import NormalPanelData from "../../../data/NormalPanelSpecs";
import Panel from "../PanelComponents/Panel";
function NormalPanelContent() {
  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      {Array.from(
        {
          length:
            NormalPanelData.length % 2 > 0
              ? NormalPanelData.length / 2 + 1
              : NormalPanelData.length / 2,
        },
        (_, i) => (
          // PRODUCT ROW
          <div
            key={i}
            className={
              "w-full h-[350px] flex justify-start items-center border-b-[2px] border-zinc-900"
            }
          >
            {NormalPanelData.slice(2 * i, 2 * i + 2).map((data, index) => (
              // PRODUCTS
              <div
                className="w-1/2 h-full border-r-[2px] border-zinc-900 overflow-hidden flex flex-col justify-start items-center"
                key={`${i}-${index}`}
              >
                <div className="w-full h-[250px] flex justify-center items-center cursor-pointer relative overflow-hidden group">
                  <div className="w-full h-[250px] absolute top-0 left-0 bg-red-800 -translate-x-[1000px] group-hover:translate-x-0 transition-all duration-500 ease-in-out">
                    
                  </div>
                  <div className="group-hover:translate-y-[1000px] transition-all duration-500">
                    <Panel
                      normalPanel={true}
                      panelSize={data.size}
                      panelGlass={data.glass}
                      panelFrame={data.frame}
                      panelVariant={data.variants}
                      panelIcons={{}}
                    />
                  </div>
                </div>
                <div className="w-full h-[100px] p-2 flex justify-between items-center">
                  <div className="flex flex-col justify-start">
                    <h1 className="text-md text-gray-600">
                      Standard Diamond Shaped Switches
                    </h1>
                    <h1 className="text-3xl">
                      {data.size} Module Standard Panel
                    </h1>
                  </div>
                  <Link className="w-14 h-14 bg-red-800 rounded-full border-2 border-black shadow-[3px_3px] flex justify-center items-center hover:shadow-none transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default NormalPanelContent;
