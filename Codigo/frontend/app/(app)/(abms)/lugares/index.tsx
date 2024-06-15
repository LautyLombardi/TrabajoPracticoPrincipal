import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Lugar, Rol } from '@/api/model/interfaces';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { FontAwesome5 } from '@expo/vector-icons';
import PlaceModal from '@/components/Modal/PlaceModal';
import useGetPlaces from '@/hooks/place/useGetPlaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useDeactivatePlace from '@/hooks/place/useDeactivatePlace';
import useActivatePlace from '@/hooks/place/useActivatePlace';

type PropsCol = {
  text?: string,
  flexWidth?: number,
  icon?: React.ReactNode
};

const Col: React.FC<PropsCol> = ({ text, flexWidth = 1, icon }) => {

  const renderChildren = () => {
    if ((text || text == '') && !icon) {
      return (
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: "center", textAlignVertical: "center" }}>{text}</Text>
      )
    } else {
      if (icon) {
        return (icon)
      } else {
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
  deleteState: boolean

  handleView: (lugar: Lugar) => void;
  handleEdit: (id: number) => void;
  handleDelete: (place: Lugar) => void;
};

const TablaLugares: React.FC<PropsTable> = ({ viewState, editState, deleteState, lugares, handleView, handleEdit, handleDelete }) => {

  const iconVerMas = (lugar: Lugar) => {
    return (
      <Ionicons name='eye-outline' style={{ fontSize: 32, padding: 7, borderRadius: 100 }} color={"white"} onPress={() => handleView(lugar)} />
    )
  }

  const deleteIcon = (place: Lugar) => {
    const isEnabled = place.isActive === 1;
    
    
    return (
      <Switch
        trackColor={{ false: '#F34C4C', true: '#27A418' }}
        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
        onValueChange={() => handleDelete(place)}
        value={isEnabled}
      />
    );
  }

  const modifyIcon = (id : number) => {
    return (
      <Ionicons name='pencil-sharp'  
      style={{fontSize: 32, padding: 7, borderRadius: 100}} 
      color={"orange"} 
      onPress={() => router.push(`/lugares/editar?id=${id}`)}
      />
    )
  }

  const handleToggleIcon = (place: Lugar): JSX.Element => {
    if (editState) {
      return modifyIcon(place.id);
    } else if (deleteState) {
      return deleteIcon(place);
    } else {
      return iconVerMas(place);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
      <Row>
        <Col text='ID' flexWidth={0.8} />
        <Col text='Nombre' flexWidth={3} />
        <Col text='Cuit' flexWidth={3} />
        <Col text='' flexWidth={1.5} />
      </Row>
      {
        lugares && Array.isArray(lugares) && lugares.map(place => (
          <Row key={place.id}>
            <Col text={place.id?.toString() || ''} flexWidth={0.8} />
            <Col text={place.name} flexWidth={3} />
            <Col text={place.abbreviation.toString()} flexWidth={3} />
            <Col flexWidth={1.5} icon={handleToggleIcon(place)} />
          </Row>
        ))
      }
    </View>
  );
};

const AdministracionLugares = () => {
  const [status, setStatusDay] = useState<boolean>(true);
  const [permition, setPermition] = useState<Rol>();
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [selectedLugar, setSelectedLugar] = useState<Lugar | null>(null);

  const deactivatePlace = useDeactivatePlace();
  const activatePlace  = useActivatePlace();

  const handleOpenUserModal = (place: Lugar) => {
    setSelectedLugar(place);
    setShowUser(true);
  };

  const handleCloseUserModal = () => {
    setSelectedLugar(null);
    setShowUser(false);
  };

  const handleDeletePlace = async (place: Lugar) => {
    if (place.isActive) {
      const result = await deactivatePlace(place.id)
      if (result !== 0) {
        console.log('place deactivated successfully.');
        setLugares(prevPlaces => prevPlaces.map(pla => 
          pla.id === place.id ? { ...pla, isActive: 0 } : pla
        ))
      } else {
        console.error('Failed to deactivate place.');
      }
    } else {
      const result = await activatePlace(place.id)
      if (result !== 0) {
        console.log('place activated successfully.');
        setLugares(prevPlaces => prevPlaces.map(pla => 
          pla.id === place.id ? { ...pla, isActive: 1 } : pla
        ))
      } else {
        console.error('Failed to activate place.');
      }
    }
  }

  // Cambio de iconos
  function handleToggleIco(icon: string) {
    if (icon == "edit" && edit || icon == "delete" && trash) {
      setEdit(false)
      setTrash(false)
    } else {
      setEdit(icon == "edit")
      setTrash(icon == "delete")
    }
  };

  const handlerDay = async () => {
    const permisos = await AsyncStorage.getItem('rol_data');
    if (permisos) {
      setPermition(JSON.parse(permisos));
    }
    const dayStatus = await AsyncStorage.getItem('dayStatus');
    const isDayOpen = dayStatus ? JSON.parse(dayStatus) : false;
    setStatusDay(isDayOpen)
  }


  // Conexion con DB
  const {places, refetch} = useGetPlaces();
  const [lugares, setLugares] = useState<Lugar[]>([])
  
  useFocusEffect(
    useCallback(() => {
      setEdit(false)
      setTrash(false)
      refetch();
    }, [refetch])
  );


  useEffect(() => {
    if(places){
      setLugares(places);}
  }, [places]);

  useEffect(() => {
    handlerDay();
  }, [])
  return (
    <View style={styles.container}>
      <HandleGoBack title='Administración de Lugares' route='menu' />
      <View style={styles.crudBtn}>
        <Pressable
          disabled={!status || (permition ? permition.entityABMs === 0 : true)}
          style={[styles.crudItem, (!status || (permition ? permition.entityABMs === 0 : true)) && styles.crudItemDisabled]}
          onPress={() => handleToggleIco("ver")}>
          <Ionicons name='eye-outline' size={20} color="black" />
        </Pressable>
        <Pressable
          disabled={!status || (permition ? permition.entityABMs === 0 : true)}
          style={[styles.crudItem, (!status || (permition ? permition.entityABMs === 0 : true)) && styles.crudItemDisabled]}
          onPress={() => handleToggleIco("delete")}>
          <FontAwesome6 name="trash" size={20} color="black" />
        </Pressable>
        <Pressable
          disabled={!status || (permition ? permition.entityABMs === 0 : true)}
          style={[styles.crudItem, (!status || (permition ? permition.entityABMs === 0 : true)) && styles.crudItemDisabled]}
          onPress={() => handleToggleIco("edit")}>
          <FontAwesome6 name="pen-clip" size={20} color="black" />
        </Pressable>
        <Pressable
          disabled={!status || (permition ? permition.entityABMs === 0 : true)}
          style={[styles.crudItem, (!status || (permition ? permition.entityABMs === 0 : true)) && styles.crudItemDisabled]}
          onPress={() => router.navigate("/lugares/registrar")}>
          <FontAwesome6 name="plus" size={20} color="black" />
        </Pressable>
      </View>
      <ScrollView style={styles.tableContainer}>
        <TablaLugares
          viewState={view}
          editState={edit}
          deleteState={trash}
          lugares={lugares}
          handleView={handleOpenUserModal}
          handleEdit={(id) => console.log("editar", id)}
          handleDelete={handleDeletePlace} />
      </ScrollView>
      {showUser && selectedLugar && <PlaceModal place={selectedLugar} handleCloseModal={handleCloseUserModal} />}
    </View>
  );
};

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
  crudItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: '5.3%',
    height: 'auto',
    marginVertical: '2%',
    justifyContent: "center",
  },
  crudItemDisabled: {
    backgroundColor: '#a3a3a3',
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