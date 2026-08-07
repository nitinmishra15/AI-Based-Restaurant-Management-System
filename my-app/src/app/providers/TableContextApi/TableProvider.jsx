import React, { createContext, useContext, useState } from "react";

export const TableContext = createContext();

export const TableProvider = ({ children }) => {
  // Initialize context state from sessionStorage on page refresh
  const [tableId, setTableIdState] = useState(() => {
    return sessionStorage.getItem("tableId") || null;
  });

  const setTableId = (newTableId) => {
    if (newTableId) {
      const cleanId = newTableId.toString().replace("#", "").trim();
      sessionStorage.setItem("tableId", cleanId);
      setTableIdState(cleanId);
    }
  };

  const clearTableId = () => {
    sessionStorage.removeItem("tableId");
    setTableIdState(null);
  };

  return (
    <TableContext.Provider value={{ tableId, setTableId, clearTableId }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => useContext(TableContext);