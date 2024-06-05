import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { TextInput } from 'react-native';
import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Excepcion } from '@/api/model/interfaces';
import { getExcepciones } from '@/api/services/excepciones';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import ExceptionModal from '@/components/Modal/ExceptionModal';

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
  excepciones: Excepcion[];

  viewState: boolean,
  editState: boolean,
  deleteState: boolean,
  
  handleView: (excepcion: Excepcion) => void;
  handleEdit: (id: number) => void;
  //handleDelete: (id: number) => void;
};

const Tablacategorias: React.FC<PropsTable> = ({ viewState, editState, deleteState, excepciones, handleView }) => {

  const iconVerMas = (excepcion: Excepcion) => {
    return (
      <Ionicons name='eye-outline' style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"white"} onPress={() => handleView(excepcion)} />
    )
  }

  const deleteIcon = (id: any) => {
    return (

      <Ionicons name='trash'  style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"red"}/>
    )
  }

  const modifyIcon = (id: any) => {
    return (
      <Ionicons name='pencil-sharp'  style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"orange"} />
    )
  }
  const handleToggleIcon = (excepcion: Excepcion): JSX.Element => {
    if (editState) {
      return modifyIcon(excepcion.id);
    } else if (deleteState) {
      return deleteIcon(excepcion.id);
    } else {
      return iconVerMas(excepcion);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
      <Row>
        <Col text='ID'flexWidth={0.8}/>
        <Col text='Nombre' flexWidth={3}/>
        <Col text='Duracion' flexWidth={3}/>
        <Col text='Lugar' flexWidth={3}/>
        <Col text='Categoria' flexWidth={3}/>
        <Col text='' flexWidth={1.5}/>
      </Row>
      {excepciones.map((excepcion) => (
        <Row key={excepcion.id}>
          <Col text={excepcion.id?.toString() || ''} flexWidth={0.8} />
          <Col text={excepcion.name} flexWidth={3} />
          <Col text={excepcion.duration} flexWidth={3} />
          <Col text={excepcion.place_name} flexWidth={3} />
          <Col text={excepcion.category_name} flexWidth={3} />
          <Col flexWidth={1.5} icon={handleToggleIcon(excepcion)} /> 
        </Row>
      ))}
    </View>
  );
};

const AdministracionCategorias = () => {
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);
  const [showException, setShowException] = useState(false);
  const [selectedException, setSelectedException] = useState<Excepcion | null>(null);

  const handleOpenUserModal = (excepcion: Excepcion) => {
    setSelectedException(excepcion);
    setShowException(true);
  };

  const handleCloseUserModal = () => {
    setSelectedException(null);
    setShowException(false);
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

  // Listado de Excepciones
  const [excepciones, setExcepciones] = useState<Excepcion[]>([]);

  useFocusEffect(
    useCallback(() => {
      getExcepciones().then((exceptions) => setExcepciones(exceptions))
    }, [])
  );

  useEffect(() => {
    getExcepciones().then((exceptions) => setExcepciones(exceptions))

  }, []);
  
  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Administración de Excepciones' route='menu' />

      {/** Buscador */}
      <View style={styles.searchContainer}>
        <TextInput placeholder='Buscar' style={styles.searchText} />
        <Pressable style={styles.searchButton}>
          <FontAwesome5 name='search' color={"black"} style={styles.searchButtonIcon} />
        </Pressable>
      </View>

      {/** Tabla */}
      <ScrollView style={styles.tableContainer}>
        <Tablacategorias 
          viewState={view} 
          editState={edit} 
          deleteState={trash} 
          excepciones={excepciones} 
          handleView={handleOpenUserModal}
          handleEdit={() => console.log("editar")}
        />
      </ScrollView>

      {showException && selectedException && <ExceptionModal excepcion={selectedException} handleCloseModal={handleCloseUserModal} />}

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
    marginTop:'3%',
    width: '100%',
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

export default AdministracionCategorias