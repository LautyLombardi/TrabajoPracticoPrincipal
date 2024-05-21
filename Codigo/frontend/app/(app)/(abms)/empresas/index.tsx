import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


type PropsCol = {
  text?: string,
  flexWidth?: number,
  icon?: React.ReactNode
};

const Col: React.FC<PropsCol> = ({text, flexWidth = 1, icon}) => {

  const renderChildren = () => {
    if((text || text=='') && !icon){
      return (
      <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold', textAlign: "center", textAlignVertical: "center" }}>{text}</Text>
      )
    }else{
      if(icon){
        return (icon) 
      }else {
        return <Text>Not Found</Text>
      }
    }
  }

  return (
    <View style={{ flex: flexWidth, paddingVertical: 12, justifyContent: "center", alignItems: "center" }}>
        {renderChildren()}
    </View>
  );
};

type PropsRow = {
  children: React.ReactNode;
};

const Row: React.FC<PropsRow> = ({ children }) => {
  return (
    <View style={{ flexDirection: 'row', borderBottomColor: 'white', borderBottomWidth: 2, alignItems: 'center' }}>
      {children}
    </View>
  );
};

type PropsTable = {
  viewState: boolean,
  editState: boolean,
  deleteState: boolean
};

const TablaEmpresa: React.FC<PropsTable> = ({ viewState, editState, deleteState }) => {

  const iconVerMas = () => {
    return (
      <Ionicons name='eye-outline' style={{fontSize: 20, backgroundColor: "black", padding: 7, borderRadius: 100}} color={"white"} />
    )
  }

  const deleteIcon = () => {
    return (
      <Ionicons name='trash'  style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"red"} />
    )
  }

  const modifyIcon = () => {
    return (
      <Ionicons name='pencil-sharp'  style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"orange"} />
    )
  }
  const handleToggleIcon = (): JSX.Element => {
    if (editState) {
      return modifyIcon();
    } else if (deleteState) {
      return deleteIcon();
    } else {
      return iconVerMas();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
      <Row>
        <Col text='ID'flexWidth={0.8}/>
        <Col text='Nombre' flexWidth={3}/>
        <Col text='Cuil'/>
        <Col text='' flexWidth={0.8}/>
      </Row>
      <Row>
        <Col text='1'flexWidth={0.8}/>
        <Col text='Coca Cola S.A' flexWidth={3}/>
        <Col text='27567323239'/>
        <Col flexWidth={0.8} icon={handleToggleIcon()}/>
      </Row>
      <Row>
        <Col text='2'flexWidth={0.8}/>
        <Col text='Lo de Victor' flexWidth={3}/>
        <Col text='23185678439'/>
        <Col flexWidth={0.8} icon={handleToggleIcon()}/>
      </Row>
      <Row>
        <Col text='3'flexWidth={0.8}/>
        <Col text='Plomeria SA' flexWidth={3}/>
        <Col text='23126547894'/>
        <Col flexWidth={0.8} icon={handleToggleIcon()}/>
      </Row>
    </View>
  );
};

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
        <View style={{height: 50, backgroundColor: "white", width: "100%", justifyContent: "flex-start", alignItems: "center", padding: 10, flexDirection: "row", gap: 10}}>
            <Ionicons name='arrow-back-outline' size={20} onPress={handleGoBack}/>
            <Text style={{fontWeight: "bold"}}>
                Administraion de Empresa
            </Text>
        </View>

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
          <Pressable style={{padding: 10, backgroundColor: "black", borderRadius: 20}} onPress={() => router.navigate("/empresas/registrar")}>
            <Text style={{color: "white", fontSize: 10, fontWeight: 300}}>Dar de alta</Text>
          </Pressable>
        </View>

        {/** Tabla */}
        <TablaEmpresa viewState={view} editState={edit} deleteState={trash}/>

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