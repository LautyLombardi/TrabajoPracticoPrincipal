import React from 'react';
import { Button } from 'react-native';
import { useCameraPermissionContext } from '../../store/CameraPermissionContext';

const CameraPermissionButton = () => {
  const { cameraPermission, updateCameraPermission } = useCameraPermissionContext();

  const requestCameraPermission = () => {
    updateCameraPermission(true);
  };

  return (
    <Button 
      title={cameraPermission ? 'Permiso concedido' : 'Solicitar permiso de cámara'}
      onPress={requestCameraPermission}
    />
  );
};

export default CameraPermissionButton;
