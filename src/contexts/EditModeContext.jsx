import { createContext, useState } from "react";

export const EditModeContext = createContext();

export function EditModeProvider({ children }) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <EditModeContext.Provider value={{ isEditing, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}

export default EditModeContext;
