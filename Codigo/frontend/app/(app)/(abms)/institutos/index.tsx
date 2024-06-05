import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { TextInput } from 'react-native';
import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { Instituto } from '@/api/model/interfaces';
import InstituteModal from '@/components/Modal/InstituteModal';
import useGetInstitutes from "@/hooks/institute/useGetInstitutes";

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
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
};

const TablaInstituto: React.FC<PropsTable> = ({ viewState, editState, deleteState, institutos, handleView }) => {

  const iconVerMas = (instituto: Instituto) => {
    return (
      <Ionicons name='eye-outline' style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"white"} onPress={() => handleView(instituto)} />
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
  const handleToggleIcon = (instituto: Instituto): JSX.Element => {
    if (editState) {
      return modifyIcon();
    } else if (deleteState) {
      return deleteIcon();
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
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);
  const [showInstitute, setShowInstitute] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<Instituto | null>(null);

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
  
  // Conexion con DB
  const instituteDB = useGetInstitutes();
  const [institutos, setInstitutos] = useState<Instituto[]>([])
  
  useFocusEffect(
    useCallback(() => {
      if (instituteDB.data) {
        setInstitutos(instituteDB.data);
      }      
    }, [[instituteDB.data]])
  );

  useEffect(() => {
    if (instituteDB.data) {
      setInstitutos(instituteDB.data);
    }
  }, [instituteDB.data]);

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Administración de Institutos' route='menu' />

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
        <Pressable style={styles.crudItem} onPress={() => router.navigate("/institutos/registrar")}>
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
          handleEdit={() => console.log("editar")} 
          handleDelete={() => console.log("borrar")}
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