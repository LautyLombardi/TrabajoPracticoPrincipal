import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Lugar } from '@/api/model/interfaces';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { FontAwesome5 } from '@expo/vector-icons';
import PlaceModal from '@/components/Modal/PlaceModal';
import useGetPlaces from '@/hooks/place/useGetPlaces';

type PropsCol = {
  text?: string,
  flexWidth?: number,
  icon?: React.ReactNode
};

const Col: React.FC<PropsCol> = ({text, flexWidth = 1, icon}) => {

  const renderChildren = () => {
    if((text || text=='') && !icon){
      return (
      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: "center", textAlignVertical: "center" }}>{text}</Text>
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
  lugares: Lugar[];
  viewState: boolean,
  editState: boolean,
  deleteState: boolean,
  
  handleView: (lugar: Lugar) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
};

const Tablacategorias: React.FC<PropsTable> = ({ viewState, editState, deleteState, lugares, handleView }) => {

  const handleDesactivarCategoria = async (id: number) => {
    try {
      // TODO:
       //await desactivarLugar(id);
      // Realizar cualquier otra acción necesaria después de desactivar la categoría
    } catch (error) {
      console.error('Error al desactivar la categoría:', error);
    }
  };

  const iconVerMas = (lugar: Lugar) => {
    return (
      <Ionicons name='eye-outline' style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"white"} onPress={() => handleView(lugar)} />
    )
  }

  const deleteIcon = (id: any) => {
    return (
      <Ionicons name='trash' style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"red"} onPress={() => handleDesactivarCategoria(id)}/>
    )
  }

  const modifyIcon = (id: any) => {
    return (
      <Ionicons name='pencil-sharp' style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"orange"} />
    )
  }

  const handleToggleIcon = (lugar: Lugar): JSX.Element => {
    if (editState) {
      return modifyIcon(lugar.id);
    } else if (deleteState) {
      return deleteIcon(lugar.id);
    } else {
      return iconVerMas(lugar);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
      <Row>
        <Col text='ID' flexWidth={0.8} />
        <Col text='Nombre' flexWidth={3}/>
        <Col text='Abreviación' flexWidth={3}/>
        <Col text='openTime' flexWidth={3}/>
        <Col text='closeTime' flexWidth={3}/>
        <Col text='' flexWidth={1.5}/>
      </Row>
      {lugares.map((lugar) => (
        <Row key={lugar.id}>
          <Col text={lugar.id?.toString() || ''} flexWidth={0.8} />
          <Col text={lugar.name} flexWidth={3} />
          <Col text={lugar.abbreviation} flexWidth={3} />
          <Col text={lugar.openTime} flexWidth={3} />
          <Col text={lugar.closeTime} flexWidth={3} />
          <Col flexWidth={1.5} icon={handleToggleIcon(lugar)} /> 
        </Row>
      ))}
    </View>
  );
};

const AdministracionLugares = () => {
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [selectedLugar, setSelectedLugar] = useState<Lugar | null>(null);

  // HandleDeleteCategoria 
  const handleDeletePlace = () => {

  }

  const handleOpenUserModal = (lugar: Lugar) => {
    setSelectedLugar(lugar);
    setShowUser(true);
  };

  const handleCloseUserModal = () => {
    setSelectedLugar(null);
    setShowUser(false);
  };

  // Cambio de iconos
  function handleToggleIco(icon : string){
    if(icon === "edit" && edit || icon === "delete" && trash){
      setEdit(false);
      setTrash(false);
    } else {
      setEdit(icon === "edit");
      setTrash(icon === "delete");        
    }
  };

  //conexion con db

  const placesDB =useGetPlaces();
  const [lugares, setLugares] = useState<Lugar[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (placesDB.data) {
        setLugares(placesDB.data);
      }      
    }, [[placesDB.data]])
  );

  useEffect(() => {
    if (placesDB.data) {
      setLugares(placesDB.data);
    }
  }, [placesDB.data]);

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Administración de Lugares' route='menu' />

      {/** Buscador */}
      <View style={styles.searchContainer}>
        <TextInput placeholder='Buscar' style={styles.searchText} />
        <Pressable style={styles.searchButton}>
          <FontAwesome5 name='search' color={"black"} style={styles.searchButtonIcon} />
        </Pressable>
      </View>

      {/** Botones CRUD */}
      <View style={styles.crudBtn}>
        <Pressable style={styles.crudItem} onPress={() => handleToggleIco("ver")}>
          <Ionicons name='eye-outline' size={20} color="black" />
        </Pressable>
        <Pressable style={styles.crudItem} onPress={() => handleToggleIco("delete")}>
          <FontAwesome6 name="trash" size={20} color="black" />
        </Pressable>
        <Pressable style={styles.crudItem} onPress={() => handleToggleIco("edit")}>
          <FontAwesome6 name="pen-clip" size={20} color="black" />
        </Pressable>
        <Pressable style={styles.crudItem} onPress={() => router.navigate("/lugares/registrar")}>
          <FontAwesome6 name="plus" size={20} color="black" />
        </Pressable>
      </View>

      {/** Tabla */}
      <ScrollView style={styles.tableContainer}>
        <Tablacategorias 
          viewState={view} 
          editState={edit} 
          deleteState={trash} 
          lugares={lugares} 
          handleView={handleOpenUserModal} 
          handleEdit={() => console.log("editar")} 
          handleDelete={handleDeletePlace}/>
      </ScrollView>
      
      {showUser && selectedLugar && <PlaceModal place={selectedLugar} handleCloseModal={handleCloseUserModal} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00759c',
    alignItems: 'center',
},
tableContainer: {
  width: '100%',
},
crudBtn: {
  flexDirection: "row", 
  width: "100%", 
  justifyContent: "flex-end", 
  alignItems: "center", 
  paddingHorizontal: 20, 
  gap: 4
},
crudItem:{
  padding: 10, 
  backgroundColor: '#fff', 
  borderRadius: 5,
  width: '5.3%',
  height: 'auto',
  marginVertical:'2%',
  justifyContent: "center", 
},
// Buscador
searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  marginTop: '2%',
  paddingHorizontal: 10,
},
searchText: {
  backgroundColor: "#fff",
  color: "black",
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 5,
  flex: 1,
  borderWidth: 1,
  borderColor: "black"
},
searchButton: {
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "black",
  borderRadius: 5,
  justifyContent: 'center',
  alignItems: 'center',
  aspectRatio: 1, 
  maxHeight: '80%',
  flexBasis: '8%', 
},
searchButtonIcon: {
  fontSize: 20,
}
});

export default AdministracionLugares