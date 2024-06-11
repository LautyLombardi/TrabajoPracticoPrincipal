import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { Instituto, Rol } from '@/api/model/interfaces';
import InstituteModal from '@/components/Modal/InstituteModal';
import useGetInstitutes from "@/hooks/institute/useGetInstitutes";
import useDeactivateInstitute from '@/hooks/institute/useDeactivateInstitute';
import useActivateInstitute from '@/hooks/institute/useActivateInstitute';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  institutos: Instituto[];
  viewState: boolean,
  editState: boolean,
  deleteState: boolean

  handleView: (instituto: Instituto) => void;
  handleDelete: (insti: Instituto) => void;
};

const TablaInstituto: React.FC<PropsTable> = ({ viewState, editState, deleteState, institutos, handleView, handleDelete}) => {

  const iconVerMas = (instituto: Instituto) => {
    return (
      <Ionicons name='eye-outline' style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"white"} onPress={() => handleView(instituto)} />
    )
  }

   const deleteIcon = (insti: Instituto) => {
    return (
      <Ionicons name='trash' style={{ fontSize: 20, padding: 7, borderRadius: 100 }} color={"red"}  onPress={() =>handleDelete(insti)}/>
    );
  };
  
  const modifyIcon = (id: number) => {
    return (
      <Ionicons name='pencil-sharp'
      style={{fontSize: 20, padding: 7, borderRadius: 100}} 
      color={"orange"} 
      onPress={() => router.push(`/institutos/editar?id=${id}`)}
      />
    )
  }
  const handleToggleIcon = (instituto: Instituto): JSX.Element => {
    if (editState) {
      return modifyIcon(instituto.id);
    } else if (deleteState) {
      return deleteIcon(instituto);
    } else {
      return iconVerMas(instituto);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
      <Row>
        <Col text='ID'flexWidth={0.8}/>
        <Col text='Nombre' flexWidth={3}/>
        <Col text='' flexWidth={1.5}/>
      </Row>
      {
        institutos.map(instituto =>(
          <Row key={instituto.id}>
            <Col text={instituto.id?.toString() || ''} flexWidth={0.8}/>
            <Col text={instituto.name} flexWidth={3} />
            <Col flexWidth={1.5} icon={handleToggleIcon(instituto)} /> 
          </Row>
        ))
      }
    </View>
  );
};

const AdministracionInstitutos = () => {
  const [status, setStatusDay] = useState<boolean>(true);
  const [permition, setPermition] = useState<Rol>();
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);
  const [showInstitute, setShowInstitute] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<Instituto | null>(null);

  const deactivateInstitute = useDeactivateInstitute();
  const activateInstitute = useActivateInstitute();

  const handleDeleteInstitute = async (insti: Instituto) => {

    if (insti.isActive) {
      const result = await deactivateInstitute(insti.id);
      if (result !== 0) {
        console.log('Institute deactivated successfully.');
        // Actualiza la lista de institutos después de desactivar uno
        setInstitutos(prevInstitutes => prevInstitutes.filter(inst => inst.id !== insti.id));
      } else {
        console.error('Failed to deactivate institute.');
      }
    }else{
      const result = await activateInstitute(insti.id);
      if (result !== 0) {
        console.log('Institute activated successfully.');
        // Actualiza la lista de institutos después de desactivar uno
        setInstitutos(prevInstitutes => prevInstitutes.filter(inst => inst.id !== insti.id));
      } else {
        console.error('Failed to activate institute.');
      }
    }
  };
  
  const handleOpenUserModal = (instituto: Instituto) => {
    setSelectedInstitute(instituto);
    setShowInstitute(true);
  };

  const handleCloseUserModal = () => {
    setSelectedInstitute(null);
    setShowInstitute(false);
  };

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
  
  const handlerDay = async () =>{
    const permisos = await AsyncStorage.getItem('rol_data');
    if(permisos){
      setPermition(JSON.parse(permisos));
    }
    const dayStatus = await AsyncStorage.getItem('dayStatus');
    const isDayOpen = dayStatus ? JSON.parse(dayStatus) : false;
    setStatusDay(isDayOpen)
  }

  // Conexion con DB
  const {institutes, refetch} = useGetInstitutes();
  const [institutos, setInstitutos] = useState<Instituto[]>([])
  
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if(institutes){
    setInstitutos(institutes);}
  }, [institutes]);

  useEffect(() => {
    handlerDay();
  }, []);

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Administración de Institutos' route='menu' />


        {/** Botones CRUD */}
      <View style={styles.crudBtn}>
        <Pressable 
            disabled={!status || (permition ? permition?.entityABMs === 0 : true) || (permition ? permition?.visitorAuthorization === 0 : true)} 
            style={[styles.crudItem, (!status || (permition ? permition.entityABMs === 0 : true) || (permition ? permition?.visitorAuthorization === 0 : true)) && styles.crudItemDisabled]} 
            onPress={() => handleToggleIco("ver")}>
          <Ionicons name='eye-outline' size={20} color="black" />
        </Pressable>
        <Pressable 
            disabled={!status || (permition ? permition?.entityABMs === 0 : true) || (permition ? permition?.visitorAuthorization === 0 : true)} 
            style={[styles.crudItem, (!status || (permition ? permition.entityABMs === 0 : true) || (permition ? permition?.visitorAuthorization === 0 : true)) && styles.crudItemDisabled]} 
            onPress={() => handleToggleIco("delete")}>
          <FontAwesome6 name="trash" size={20} color="black" />
        </Pressable>
        <Pressable  
            disabled={!status || (permition ? permition?.entityABMs === 0 : true) || (permition ? permition?.visitorAuthorization === 0 : true)} 
            style={[styles.crudItem, (!status || (permition ? permition.entityABMs === 0 : true) || (permition ? permition?.visitorAuthorization === 0 : true)) && styles.crudItemDisabled]} 
            onPress={() => handleToggleIco("edit")}>
          <FontAwesome6 name="pen-clip" size={20} color="black" />
        </Pressable>
        <Pressable 
            disabled={!status || (permition ? permition?.entityABMs === 0 : true) || (permition ? permition?.visitorAuthorization === 0 : true)} 
            style={[styles.crudItem, (!status || (permition ? permition.entityABMs === 0 : true) || (permition ? permition?.visitorAuthorization === 0 : true)) && styles.crudItemDisabled]} 
            onPress={() => router.navigate("/institutos/registrar")}>
          <FontAwesome6 name="plus" size={20} color="black" />
        </Pressable>
      </View>

      {/** Tabla */}
      <ScrollView style={styles.tableContainer}>
        <TablaInstituto 
          viewState={view} 
          editState={edit} 
          deleteState={trash} 
          institutos={institutos} 
          handleView={handleOpenUserModal}
          handleDelete={handleDeleteInstitute}
        />
      </ScrollView>

      {showInstitute && selectedInstitute && <InstituteModal instituto={selectedInstitute} handleCloseModal={handleCloseUserModal} />}

    </View>
  )
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

export default AdministracionInstitutos;
