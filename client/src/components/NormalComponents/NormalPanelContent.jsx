import { Link } from "react-router-dom";
import Panel from "../PanelComponents/Panel";
import { useContext, useEffect, useState } from "react";
import { NormalContext } from "../../context/NormalContextProvider";
import Loading from "../Loading";

function NormalPanelContent() {
  const [NormalPanelData, setNormalPanelData] = useState(null);

  // GETTING DATA
  async function getNormalPanelData() {
    try {
      const res = await fetch("/api/v1/user/get-normal-panel", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success === true) {
        setNormalPanelData(data.panels);
      } else {
        alert("Error", data.message);
      }
    } catch (error) {
      alert("Error");
    }
  }

  useEffect(() => {
    getNormalPanelData();
  }, []);

  const { normalFilter } = useContext(NormalContext);
  let NormalPanels = [];
  if (normalFilter.panelSize.length > 0) {
    NormalPanels = NormalPanelData.filter((item) =>
      normalFilter.panelSize.includes(item.size)
    );
  } else {
    NormalPanels = NormalPanelData;
  }
  return (
    <>
      {NormalPanelData === null ? (
        <Loading />
      ) : (
        <div className="w-full flex flex-col overflow-x-hidden">
          {Array.from(
            {
              length:
                NormalPanels.length % 2 > 0
                  ? NormalPanels.length / 2 + 1
                  : NormalPanels.length / 2,
            },
            (_, i) => (
              // PRODUCT ROW
              <div
                key={i}
                className={
                  "w-full h-[700px] md:h-[350px] flex flex-col md:flex-row justify-start items-center md:border-b-[2px] md:border-zinc-900"
                }
              >
                {NormalPanels.slice(2 * i, 2 * i + 2).map((data, index) => (
                  // PRODUCTS
                  <div
                    className="w-full md:w-1/2 h-full border-r-[2px] border-zinc-900 overflow-hidden flex flex-col justify-start items-center border-b-[2px] md:border-b-0"
                    key={`${i}-${index}`}
                  >
                    <div className="w-full h-[250px] flex justify-center items-center cursor-pointer relative overflow-hidden group">
                      <div className="w-full h-[250px] absolute top-0 left-0 bg-red-800 -translate-x-[1000px] group-hover:translate-x-0 transition-all duration-500 ease-in-out flex justify-center items-center">
                        <div className="w-[90%] p-4 border-2 border-gray-300 flex flex-col">
                          <h1 className="text-white font-semibold">
                            Panel Name : {data.name}{" "}
                          </h1>
                          <h1 className="text-white font-semibold">
                            Panel Size : {data.size}{" "}
                          </h1>
                          <h1 className="text-white font-semibold">
                            Panel Glass : {data.glass}{" "}
                          </h1>
                          <h1 className="text-white font-semibold">
                            Panel Frame : {data.frame}{" "}
                          </h1>
                        </div>
                      </div>
                      <div className="group-hover:translate-x-[1000px] transition-all duration-500">
                        {data.size < 12 && (
                          <Panel
                            normalPanel={true}
                            panelSize={data.size}
                            panelGlass={data.glass}
                            panelFrame={data.frame}
                            panelVariant={data.variant}
                            panelIcons={{}}
                          />
                        )}
                      </div>
                    </div>

                    <div className="w-full h-[100px] p-2 flex justify-between items-center">
                      <div className="flex flex-col justify-start">
                        <h1 className="text-md text-gray-600">
                          {data.size} Module Standard Panel
                        </h1>
                        <h1 className="text-3xl">{data.name}</h1>
                      </div>

                      {/* ADD TO COLLECTION PANEL  */}
                      <Link
                        to={`/normal-panels/${data._id}`}
                        className="w-14 h-14 bg-red-800 rounded-full border-2 border-black shadow-[3px_3px] flex justify-center items-center hover:shadow-none transition-all duration-300 cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-10 stroke-gray-300"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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
      )}
    </>
  );
}

export default NormalPanelContent;
