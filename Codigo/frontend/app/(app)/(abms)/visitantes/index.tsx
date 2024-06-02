import { View, Text, StyleSheet, Pressable,TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { Visitante } from '@/api/model/interfaces';
import { getVisitantes } from '@/api/services/visitantes';
import { useFocusEffect } from '@react-navigation/native';
import VisitorModal from '@/components/Modal/VisitorModal';

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
  visitantes: Visitante[]
  viewState: boolean,
  editState: boolean,
  deleteState: boolean,
  
  handleView: (visitante: Visitante) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
};

const TablaVisitantes: React.FC<PropsTable> = ({ viewState, editState, deleteState, visitantes, handleView }) => {

  const iconVerMas = (visitante: Visitante) => {
    return (
      <Ionicons name='eye-outline' style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"white"} onPress={() => handleView(visitante)} />
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
  const handleToggleIcon = (visitante: Visitante): JSX.Element => {
    if (editState) {
      return modifyIcon();
    } else if (deleteState) {
      return deleteIcon();
    } else {
      return iconVerMas(visitante);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
      <Row>
        <Col text='DNI'flexWidth={3}/>
        <Col text='Nombre' flexWidth={3}/>
        <Col text='Apellido' flexWidth={3}/>
        <Col text='Fecha Incio en la UNGS' flexWidth={3.5}/>
        <Col text='Categoria' flexWidth={3}/>
        <Col text='' flexWidth={1.5}/>
      </Row>
      {visitantes.map((visitante) => 
        <Row key={visitante.dni} >
          <Col text={visitante.dni.toString()} flexWidth={3} />
          <Col text={visitante.name} flexWidth={3} />
          <Col text={visitante.lastname} flexWidth={3} />
          <Col text={visitante.startDate} flexWidth={3.5} />
          <Col text={visitante.category} flexWidth={3} />
          <Col flexWidth={1.5} icon={handleToggleIcon(visitante)} /> 
        </Row>
      )}
    </View>
  );
};

const AdministracionVisitantes = () => {
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);
  const [showVisitor, setShowVisitor] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitante | null>(null);

  const handleOpenUserModal = (visitante: Visitante) => {
    setSelectedVisitor(visitante);
    setShowVisitor(true);
  };

  const handleCloseUserModal = () => {
    setSelectedVisitor(null);
    setShowVisitor(false);
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

  const [visitantes, setVisitantes] = useState<Visitante[]>([]);

  useFocusEffect(
    useCallback(() => {
      getVisitantes().then((visitors) => setVisitantes(visitors))
    }, [])
  );

  useEffect(() => {
    getVisitantes().then((visitors) => setVisitantes(visitors))

  }, []);
  
  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Administraión de Visitantes' route='menu' />

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
        <Pressable style={styles.crudItem} onPress={() => router.navigate("/visitantes/registrar")}>
          <FontAwesome6 name="plus" size={20} color="black" />
        </Pressable>
      </View>

      {/** Tabla */}
      <ScrollView style={styles.tableContainer}>
        <TablaVisitantes 
          viewState={view} 
          editState={edit} 
          deleteState={trash} 
          visitantes={visitantes}
          handleView={handleOpenUserModal}
          handleEdit={() => console.log("editar")} 
          handleDelete={() => console.log("borrar")}
          />
      </ScrollView>

      {showVisitor && selectedVisitor && <VisitorModal visitor={selectedVisitor} handleCloseModal={handleCloseUserModal} />}

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

export default AdministracionVisitantes