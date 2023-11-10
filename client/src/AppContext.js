import React, { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
    const [searchParam, setSearchParam] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");
  
    return (
      <AppContext.Provider value={{ searchParam, setSearchParam, selectedLabel, setSelectedLabel }}>
        {children}
      </AppContext.Provider>
    );
  };