import React, { createContext, useContext, useState } from 'react';

const CameraPermissionContext = createContext();

export const CameraPermissionProvider = ({ children }) => {
  const [cameraPermission, setCameraPermission] = useState(false);

  const updateCameraPermission = (permission) => {
    setCameraPermission(permission);
  };

  return (
    <CameraPermissionContext.Provider value={{ cameraPermission, updateCameraPermission }}>
      {children}
    </CameraPermissionContext.Provider>
  );
};

export const useCameraPermissionContext = () => useContext(CameraPermissionContext);
