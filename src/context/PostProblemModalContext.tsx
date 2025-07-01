import React, { createContext, ReactNode, useContext, useState } from "react";

interface PostProblemModalContextType {
  isOpen: boolean;
  openModal: (templateData?: any) => void;
  closeModal: () => void;
  templateData?: any;
}

const PostProblemModalContext = createContext<
  PostProblemModalContextType | undefined
>(undefined);

export const usePostProblemModal = () => {
  const context = useContext(PostProblemModalContext);
  if (!context) {
    throw new Error(
      "usePostProblemModal must be used within a PostProblemModalProvider"
    );
  }
  return context;
};

interface PostProblemModalProviderProps {
  children: ReactNode;
}

export const PostProblemModalProvider: React.FC<
  PostProblemModalProviderProps
> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [templateData, setTemplateData] = useState<any>(undefined);

  const openModal = (templateData?: any) => {
    setTemplateData(templateData);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTemplateData(undefined);
  };

  const value = {
    isOpen,
    openModal,
    closeModal,
    templateData,
  };

  return (
    <PostProblemModalContext.Provider value={value}>
      {children}
    </PostProblemModalContext.Provider>
  );
};
