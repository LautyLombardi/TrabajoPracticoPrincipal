import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

interface LectorQrProps {
  onQRCodeScanned: (data: string) => void;
}

const LectorQr: React.FC<LectorQrProps> = ({ onQRCodeScanned }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    const regex = /(?<=@[^@]*@[^@]*@[^@]*@)[^@]+/;
    const datos = data;
    const match = datos.match(regex);

    if (match) {
      Alert.alert('QR Code Scanned', `Scanned data: ${match[0]}`);
      onQRCodeScanned(match[0]);
    } else {
      Alert.alert('No QR Code Scanned', 'No QR code data found');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LectorQr;