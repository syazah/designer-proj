import { useContext } from "react";
import { NormalContext } from "../../context/NormalContextProvider";

function NormalSidebar() {
  const { normalFilter, setNormalFilter } = useContext(NormalContext);
  return (
    <div className="w-[15%] flex-grow border-r-[2px] border-zinc-900 flex flex-col p-2">
      <div className="flex flex-col gap-2 justify-start border-b-[2px] border-zinc-900 pb-2 ">
        <h1 className="text-xl font-semibold">Filter BY</h1>
        <div className="w-full flex flex-col justify-start items-start gap-1">
          {normalFilter.panelSize.length > 0 &&
            normalFilter.panelSize.map((size) => (
              <div
                key={size}
                className="rounded-full py-1 pr-2 bg-gray-600 flex gap-1 justify-center items-center cursor-pointer"
              >
                <svg
                  onClick={() =>
                    setNormalFilter({
                      ...normalFilter,
                      panelSize: normalFilter.panelSize.filter(
                        (s) => s != size
                      ),
                    })
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 stroke-white hover:stroke-gray-800 transition-all duration-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h2 className="text-sm text-gray-50">{size} Module</h2>
              </div>
            ))}
        </div>
      </div>

      {/* normalFilterS  */}
      <div className=" justify-start border-b-[2px] border-zinc-900 mt-4 pb-4">
        <h1 className="text-xl font-semibold">MODULE SIZE</h1>
        <div className="flex flex-col gap-2">
          {[2, 4, 6, 8, 12].map((size, i) => (
            <div key={i} className="flex justify-start items-center gap-2">
              <div
                onClick={() => {
                  if (normalFilter.panelSize.includes(size)) {
                    setNormalFilter({
                      ...normalFilter,
                      panelSize: normalFilter.panelSize.filter(
                        (s) => s != size
                      ),
                    });
                  } else {
                    setNormalFilter({
                      ...normalFilter,
                      panelSize: [...normalFilter.panelSize, size],
                    });
                  }
                }}
                className="w-4 h-4 rounded-full flex justify-center items-center border-zinc-900 border-[2px] cursor-pointer"
              >
                {normalFilter.panelSize.includes(size) && (
                  <div className="w-2 h-2 rounded-full bg-zinc-900"></div>
                )}
              </div>
              <h1>{size} Module</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NormalSidebar;
