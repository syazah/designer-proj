import { createContext, useState } from "react";

const NormalContext = createContext(null);
function NormalContextProvider({ children }) {
  const [normalFilter, setNormalFilter] = useState({
    panelSize: [],
    panelColor: "all",
  });
  return (
    <NormalContext.Provider value={{ normalFilter, setNormalFilter }}>
      {children}
    </NormalContext.Provider>
  );
}

export { NormalContextProvider, NormalContext };
