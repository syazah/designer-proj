import { createContext, useEffect, useState } from "react";

const PanelContext = createContext(null);
function PanelContextProvider({ children }) {
  const [panelSpecs, setPanelSpecs] = useState({
    panelSize: 2,
    panelVariant: [],
    bigPanelVariant: [[], []],
    panelIcons: {},
    panelGlass: "#000",
    panelFrame: "#ddd",
    panelWall: "",
    droppableType: 1,
    droppableColor: "#17c5e2",
  });
  const [spaceLeft, setSpaceLeft] = useState(panelSpecs.panelSize);
  const [panelCollectionContext, setPanelCollectionContext] = useState(null);
  const [initialSignIn, setInitialSignIn] = useState(false);
  const [upSpace, setUpSpace] = useState(6);

  useEffect(() => {
    if (panelSpecs.panelSize) {
      setSpaceLeft(panelSpecs.panelSize);
    }
  }, [panelSpecs.panelSize]);
  return (
    <PanelContext.Provider
      value={{
        panelSpecs,
        setPanelSpecs,
        spaceLeft,
        setSpaceLeft,
        panelCollectionContext,
        setPanelCollectionContext,
        initialSignIn,
        setInitialSignIn,
        upSpace,
        setUpSpace,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}

export { PanelContextProvider, PanelContext };
