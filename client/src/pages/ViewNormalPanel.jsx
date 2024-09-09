import { useParams } from "react-router-dom";
import Panel from "../components/PanelComponents/Panel";
import ComNavbar from "../components/NormalComponents/ComNavbar";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
function ViewNormalPanel() {
  const { id } = useParams();
  const [panelInfo, setPanelInfo] = useState(null);
  const [collectionsInfo, setCollectionsInfo] = useState(null);
  const [panelBackgroundColor, setPanelBackgroundColor] = useState("");
  const [panelGlassColor, setPanelGlassColor] = useState("");
  const [panelFrameColor, setPanelFrameColor] = useState("");
  const [collectionValue, setCollectionValue] = useState("");
  const width = window.innerWidth;

  const [addCollectionLoading, setAddCollectionLoading] = useState(false);

  async function GETPanel() {
    try {
      const userData = sessionStorage.getItem("userData");
      const _id = JSON.parse(userData);
      const res = await fetch("/api/v1/user/normal-panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: _id, panelID: id }),
      });
      const data = await res.json();
      if (data.success === true) {
        setCollectionsInfo(data.collections.collectionsCreated);
        setPanelInfo(data.panel);
      } else {
        alert("Error", data.message);
      }
    } catch (error) {
      alert("Error");
    }
  }

  async function handleAddToCollection() {
    const completeFormData = {
      panelId: id,
      collectionId: collectionValue,
      panelGlass: panelGlassColor === "" ? "#000" : panelGlassColor,
      panelFrame: panelFrameColor === "" ? "#ab936b" : panelFrameColor,
      panelWall: panelBackgroundColor,
    };
    console.log(completeFormData);
    try {
      setAddCollectionLoading(true);
      const res = await fetch("/api/v1/user/add-normal-panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeFormData),
      });
      const data = await res.json();
      if (data.success === true) {
        alert("Added Successfully");
      } else {
        alert(`Error - ${data.message}`);
      }
      setAddCollectionLoading(false);
    } catch (error) {
      setAddCollectionLoading(false);
      alert(JSON.stringify(error));
    }
  }

  //   USE EFFECT
  useEffect(() => {
    GETPanel();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-[100vh] flex flex-col bg-gray-300">
      <ComNavbar />
      {panelInfo === null || collectionsInfo === null ? (
        <Loading />
      ) : (
        <div className="w-full h-full flex flex-col">
          <div className="w-full p-2 flex flex-col justify-start items-start border-b-[2px] border-zinc-900">
            <h1 className="text-xl font-semibold">{panelInfo.name}</h1>
            <h1 className="text-sm font-medium">
              {panelInfo.size} Module Standard Panel
            </h1>
          </div>
          <div className="flex flex-col md:flex-row w-full h-full">
            <div
              style={{ backgroundColor: panelBackgroundColor }}
              className="w-full md:border-r-[2px] border-zinc-900 flex flex-col justify-start items-center scale-75 md:scale-100 md:flex-row  md:justify-center md:items-center"
            >
              <Panel
                normalPanel={true}
                normalPanelRegSize={width > 750 ? true : false}
                panelSize={panelInfo.size}
                panelFrame={
                  panelFrameColor === "" ? panelInfo.frame : panelFrameColor
                }
                panelGlass={
                  panelGlassColor != "" ? panelGlassColor : panelInfo.glass
                }
                panelVariant={panelInfo.variant}
                panelIcons={{}}
              />
            </div>

            <div className="flex w-full md:w-[15%] flex-col justify-start items-start p-2 gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm">Select Background</h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    "#27272a",
                    "#36454F",
                    "#E6E6FA",
                    "#b0b0b0",
                    "#BEBEBE",
                    "#f5f5dc",
                    "#FFDAB9",
                    "#D2B48C",
                    "#E2725B",
                    "#800020",
                    "#ADD8E6",
                    "#6A5ACD",
                    "#93E9BE",
                    "#000080",
                  ].map((item, index) => (
                    <div
                      onClick={() => setPanelBackgroundColor(item)}
                      key={index}
                      style={{ backgroundColor: item }}
                      className="w-5 h-5 rounded-full cursor-pointer border-[2px] border-zinc-950"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-sm">Select Panel Glass</h2>
                <div className="flex flex-wrap gap-2">
                  {["#000", "#36454F", "#ab936b"].map((item, index) => (
                    <div
                      onClick={() => setPanelGlassColor(item)}
                      key={index}
                      style={{ backgroundColor: item }}
                      className="w-5 h-5 rounded-full cursor-pointer border-[2px] border-zinc-950"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-sm">Select Panel Frame</h2>
                <div className="flex flex-wrap gap-2">
                  {["#000", "#36454F", "#eee", "#ab936b"].map((item, index) => (
                    <div
                      onClick={() => setPanelFrameColor(item)}
                      key={index}
                      style={{ backgroundColor: item }}
                      className="w-5 h-5 rounded-full cursor-pointer border-[2px] border-zinc-950"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-sm">Choose Collection</h2>
                <select
                  value={collectionValue}
                  onChange={(e) => setCollectionValue(e.target.value)}
                  className="w-full border-none outline-none bg-white p-2 text-black"
                >
                  <option value={""}>-------</option>
                  {collectionsInfo.map((item) => (
                    <option value={item._id} key={`${item._id}-coll`}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCollection}
                className="w-full p-2 bg-red-800 text-white rounded-xl shadow-[5px_5px_#000] hover:shadow-none transition-all duration-200"
              >
                {addCollectionLoading ? "Loading..." : "Add To Collection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewNormalPanel;
