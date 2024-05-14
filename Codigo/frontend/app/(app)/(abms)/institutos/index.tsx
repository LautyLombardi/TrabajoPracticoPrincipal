import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Header from '@/ui/Header';
import Table from '@/ui/Table/Table';

const AdministracionEmpresas = () => {
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);


  // Cambio de iconos
  function handleToggleIco(icon : string){
    if(icon == "edit" && edit || icon == "delete" && trash){
      setEdit(false)
      setTrash(false)
    }else {
      setEdit(icon == "edit")
      setTrash(icon == "delete")        
    }
  };


  // Router
  const handleGoBack = () => {
    const canGoBack = router.canGoBack();
    if(canGoBack){
      router.back()
    }else{
      router.navigate("/menu")
    }
  }


  return (
    <View style={styles.container}>
        {/** Header Menu */}
        <Header title="Administracion de Institutos" handleGoBack={handleGoBack}/>

        {/** Buscador */}
        <View style={{flexDirection: "row", alignItems: "center", width: "100%", marginTop: 20, paddingHorizontal: 10, gap: 8}}>
          <TextInput placeholder='Buscar' style={{backgroundColor: "white", color:"black", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, flex: 2, borderWidth: 1, borderColor: "black"}}/>
          <Ionicons name='search' color={"white"} style={{fontSize: 27, backgroundColor: "black", borderWidth: 1, borderColor: "white", borderRadius: 25, padding: 5}}/>
        </View>

        {/** Botones CRUD */}
        <View style={{flexDirection: "row", width: "100%", justifyContent: "flex-end", marginVertical: 15, alignItems: "center", paddingHorizontal: 20, gap: 5}}>
          <Pressable style={{padding: 10, backgroundColor: trash ? 'red' : 'black', borderRadius: 20}} onPress={() => handleToggleIco("delete")}>
            <Text style={{color: "white", fontSize: 10, fontWeight: 300}}>Dar de baja</Text>
          </Pressable>
          <Pressable style={{padding: 10, backgroundColor: edit? "orange" : "black", borderRadius: 20}} onPress={() => handleToggleIco("edit")}>
            <Text style={{color: "white", fontSize: 10, fontWeight: 300}}>Modificar</Text>
          </Pressable>
          <Pressable style={{padding: 10, backgroundColor: "black", borderRadius: 20}} onPress={() => router.navigate("/institutos/registrar")}>
            <Text style={{color: "white", fontSize: 10, fontWeight: 300}}>Dar de alta</Text>
          </Pressable>
        </View>

        {/** Tabla */}
        <Table viewState={view} editState={edit} deleteState={trash}/>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#000051',
      alignItems: 'center',
  },
});

export default AdministracionEmpresas