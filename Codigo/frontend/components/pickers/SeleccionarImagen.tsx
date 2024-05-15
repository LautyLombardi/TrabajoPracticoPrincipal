import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Boton from '@/ui/Boton';
import * as ImagePicker from 'expo-image-picker';

const SeleccionarImagen = ({imagen, onChange}: any) => {

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
    
      console.log(result);
    
      if (!result.canceled) {
        onChange(result.assets[0].uri);
      }
    };
    
    return (<>
        <Boton  backgroundColor="white" padding={20}  borderRadius={5} fontSze={15} text="Selecciona una imagen" onPress={pickImage} />
        {imagen && <Image  source={{ uri: imagen }} style={styles.image} />}    
    </>
    );
    }
    
    const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 10
    },
    image: {
      width: 170,
      height: 170,
      borderRadius: 2,
      borderWidth: 2,
    },
})

export default SeleccionarImagen;