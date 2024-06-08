import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import HandleGoBackReg from '@/components/handleGoBack/HandleGoBackReg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InstitutionalImage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleTerminar = async () => {
    setLoading(true);
    await new Promise<void>(resolve => setTimeout(resolve, 2000));
    setLoading(false);

    if (selectedImage) {
      await AsyncStorage.setItem('institutionalImage', selectedImage);
    }

    Alert.alert(
      "Se cambió la imagen institucional",
      "",
      [{ text: "OK", onPress: () => router.navigate("/menu") }]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert("Se requieren permisos para acceder a las imagenes");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <HandleGoBackReg title='Cambio de imagen institucional' route='menu' />
      
      <View style={styles.formContainer}>
        <Pressable style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </Pressable>
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.logo} />}
      </View>
      
      <Pressable onPress={handleTerminar} style={styles.button}>
        <Text style={styles.buttonText}>Cambiar imagen institucional</Text>
      </Pressable>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00759c',
    flex: 1,
    paddingVertical: 30,
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  buttonText: {
    color: '#000051',
    fontSize: 16,
  },
  logo: {
    width: 300,
    height: 250,
    marginTop: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InstitutionalImage;
