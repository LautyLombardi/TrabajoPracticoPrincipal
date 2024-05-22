import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Header from '@/ui/Header';
import Table from '@/ui/Table/Table';
import { Instituto } from '@/api/model/interfaces';
import { getInstitutos } from '@/api/services/institutos';

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
  deleteState: boolean,
  institutos: Instituto[]
};

const TableInstitutos: React.FC<PropsTable> = ({ viewState, editState, deleteState, institutos }) => {

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
        <Col text='CreateDate'/>
        <Col text='' flexWidth={0.8}/>
      </Row>
      {institutos.map((instituto) => 
              <Row key={instituto.id}>
              <Col text={instituto.id? instituto.id.toString() : ''} flexWidth={0.8} />
              <Col text={instituto.name} flexWidth={3} />
              <Col text={instituto.createDate} flexWidth={3} />
              <Col text='' flexWidth={0.8} />
            </Row>
      )}
    </View>
  );
};

const AdministracionInstitutos = () => {
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

  const [institutos, setInstitutos] = useState<Instituto[]>([])

  useEffect(() => {
    getInstitutos().then((institutes) => setInstitutos(institutes))
  }, []);

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
        <TableInstitutos viewState={view} editState={edit} deleteState={trash} institutos={institutos}/>

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

export default AdministracionInstitutos