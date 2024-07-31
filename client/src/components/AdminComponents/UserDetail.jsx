import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../Loading";
import Panel from "../PanelComponents/Panel";

function UserDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [completeData, setCompleteData] = useState(null);
  //   GET COMPLETE USER DETAIL
  async function getCompleteUserDetail() {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/user-detail-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success === true) {
        setCompleteData(data.data);
        console.log(completeData);
      } else {
        alert("Error", data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error);
    }
  }
  useEffect(() => {
    getCompleteUserDetail();
  }, []);
  return (
    <div className="w-full bg-zinc-900 text-white">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full h-full p-4 flex flex-col gap-4">
          {/* USER DETAILS  */}
          <div className="w-full p-4 bg-zinc-950 rounded-xl flex flex-col">
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Name</h1>
              <h1 className="text-lg text-white">{completeData?.name}</h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Email</h1>
              <h1 className="text-lg text-white">{completeData?.email}</h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Username</h1>
              <h1 className="text-lg text-white">{completeData?.username}</h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Number</h1>
              <h1 className="text-lg text-white">{completeData?.number}</h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Country</h1>
              <h1 className="text-lg text-white">{completeData?.country}</h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">City</h1>
              <h1 className="text-lg text-white">{completeData?.city}</h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Created By</h1>
              <h1 className="text-lg text-white">
                {completeData?.createdBy?.name} - {completeData?.createdByModel}
              </h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Collections Created</h1>
              <h1 className="text-lg text-white">
                {completeData?.collectionsCreated.length}
              </h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Panels Created</h1>
              <h1 className="text-lg text-white">
                {completeData?.panelsCreated.length}
              </h1>
            </div>
          </div>

          {/* COLLECTION DETAILS  */}
          <div className="w-full bg-zinc-950 p-4 flex flex-col justify-start items-start gap-4">
            <h1 className="text-2xl text-red-600 border-b-[2px] border-red-600">
              Collections
            </h1>
            {completeData?.collectionsCreated?.map((collection, i) => (
              <div key={collection._id} className="w-full">
                <h1 className="text-lg">
                  {i + 1}
                  {")"} {collection.name}
                </h1>
                <div className="w-full flex flex-col justify-start items-start gap-4">
                  {collection?.panels?.map((panel) => (
                    <div
                      key={panel._id}
                      className="bg-zinc-900 w-full rounded-xl flex flex-col overflow-hidden relative"
                    >
                      <div
                        style={{
                          backgroundColor:
                            panel.panelData?.panelWall ?? "#121217",
                        }}
                        className="available-panel flex justify-center items-center w-full h-[400px]"
                      >
                        {panel?.panelData != null && (
                          <Panel
                            panelSize={panel.panelData.panelSize}
                            panelGlass={panel.panelData.panelGlass}
                            panelFrame={panel.panelData.panelFrame}
                            panelVariant={panel.panelData.panelVariant}
                            panelIcons={Object.entries(
                              panel.panelData?.panelIcons || {}
                            )}
                          />
                        )}
                      </div>

                      {/* PANEL DATA  */}
                      <div className="flex justify-between p-4 items-center">
                        <h1 className="text-xl font-medium text-white">
                          {panel.panelName}
                        </h1>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetail;
