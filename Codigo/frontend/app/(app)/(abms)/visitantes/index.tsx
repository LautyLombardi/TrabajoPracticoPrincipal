import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { Visitante } from '@/api/model/interfaces';
import VisitorModal from '@/components/Modal/VisitorModal';
import useGetVisitors from '@/hooks/visitor/useGetVisitors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useDeactivateVisitor from '@/hooks/visitor/useDeactivateVisitor';
import useActivateVisitor from '@/hooks/visitor/useActivateVisitor';

type PropsCol = {
  text?: string,
  flexWidth?: number,
  icon?: React.ReactNode
};

const Col: React.FC<PropsCol> = ({ text, flexWidth = 1, icon }) => {
  const renderChildren = () => {
    if ((text || text === '') && !icon) {
      return (
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: "center", textAlignVertical: "center" }}>{text}</Text>
      );
    } else {
      if (icon) {
        return (icon);
      } else {
        return <Text>Not Found</Text>;
      }
    }
  };

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
  visitantes: Visitante[];
  viewState: boolean;
  editState: boolean;
  deleteState: boolean;
  
  handleView: (visitante: Visitante) => void;
  handleEdit: (id: number) => void;
  handleDelete: (visitor: Visitante) => void;
};

const TablaVisitantes: React.FC<PropsTable> = ({ viewState, editState, deleteState, visitantes, handleView, handleEdit, handleDelete }) => {

  const iconVerMas = (visitante: Visitante) => {
    return (
      <Ionicons name='eye-outline' style={{ fontSize: 20, padding: 7, borderRadius: 100 }} color={"white"} onPress={() => handleView(visitante)} />
    );
  };

  const deleteIcon = (visitor: Visitante) => {
    return (
      <TouchableOpacity onPress={() => handleDelete(visitor)}>
        <Ionicons name='trash' style={{ fontSize: 20, padding: 7, borderRadius: 100 }} color={"red"} />
      </TouchableOpacity>
    );
  };

  const modifyIcon = (dni: number) => {
    return (
      <Ionicons name='pencil-sharp'  
        style={{fontSize: 20, padding: 7, borderRadius: 100}} 
        color={"orange"} 
        onPress={() => router.push(`/visitantes/editar?dni=${dni}`)}
      />
    )
  }
  const handleToggleIcon = (visitante: Visitante): JSX.Element => {
    if (editState) {
      return modifyIcon(visitante.dni);
    } else if (deleteState) {
      return deleteIcon(visitante);
    } else {
      return iconVerMas(visitante);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
      <Row>
        <Col text='DNI' flexWidth={3} />
        <Col text='Nombre' flexWidth={3} />
        <Col text='Apellido' flexWidth={3} />
        <Col text='Fecha Incio en la UNGS' flexWidth={5} />
        <Col text='Categoria' flexWidth={3} />
        <Col text='' flexWidth={1.5} />
      </Row>
      {visitantes.map((visitante) =>
        <Row key={visitante.dni}>
          <Col text={visitante.dni.toString()} flexWidth={3} />
          <Col text={visitante.name} flexWidth={3} />
          <Col text={visitante.lastname} flexWidth={3} />
          <Col text={visitante.startDate} flexWidth={5} />
          <Col text={visitante.category} flexWidth={3} />
          <Col flexWidth={1.5} icon={handleToggleIcon(visitante)} />
        </Row>
      )}
    </View>
  );
};

const AdministracionVisitantes = () => {
  const [status, setStatusDay] = useState<boolean>(true);
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);
  const [showVisitor, setShowVisitor] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitante | null>(null);

  const deactivateVisitor = useDeactivateVisitor();
  const activateVisitor = useActivateVisitor();

  const handleOpenUserModal = (visitante: Visitante) => {
    setSelectedVisitor(visitante);
    setShowVisitor(true);
  };

  const handleCloseUserModal = () => {
    setSelectedVisitor(null);
    setShowVisitor(false);
  };

  const handleDeleteVisitor = async (visitor: Visitante) => {
    if (visitor.isActive) {
      const result = await deactivateVisitor(visitor.dni);
      if (result !== 0) {
        console.log('visitor deactivated successfully.');
        const handleInsts = visitantes
        handleInsts.forEach(vist =>{
          if (vist.dni === visitor.dni) {
            vist.isActive = 0
          }
        })
        setVisitantes(handleInsts)
      } else {
        console.error('Failed to deactivate visitor.');
      }
    } else {
      const result = await activateVisitor(visitor.dni);
      if (result !== 0) {
        console.log('visitor activated successfully.');
        const handleInsts = visitantes
        handleInsts.forEach(vist =>{
          if (vist.dni === visitor.dni) {
            vist.isActive = 1
          }
        })
        setVisitantes(handleInsts)
      } else {
        console.error('Failed to activate visitor.');
      }
    }
  };

  // Cambio de iconos
  const handleToggleIco = (icon: string) => {
    if ((icon === "edit" && edit) || (icon === "delete" && trash)) {
      setEdit(false);
      setTrash(false);
    } else {
      setEdit(icon === "edit");
      setTrash(icon === "delete");
    }
  };

  const handlerDay = async () => {
    const dayStatus = await AsyncStorage.getItem('dayStatus');
    const isDayOpen = dayStatus ? JSON.parse(dayStatus) : false;
    setStatusDay(isDayOpen);
  };

  const {visitors, refetch} = useGetVisitors();
  const [visitantes, setVisitantes] = useState<Visitante[]>([]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    console.log("visitor en la pantalla" , visitors)
    if(visitors){
      setVisitantes(visitors);}
    }, [visitors]);;

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Administración de Visitantes' route='menu' />

      {/** Buscador */}
      <View style={styles.searchContainer}>
        <TextInput placeholder='Buscar' style={styles.searchText} />
        <Pressable style={styles.searchButton}>
          <FontAwesome5 name='search' color={"black"} style={styles.searchButtonIcon} />
        </Pressable>
      </View>

      {/** Botones CRUD */}
      <View style={styles.crudBtn}>
        <Pressable disabled={!status} style={[styles.crudItem, !status && styles.crudItemDisabled]} onPress={() => handleToggleIco("ver")}>
          <Ionicons name='eye-outline' size={20} color="black" />
        </Pressable>
        <Pressable disabled={!status} style={[styles.crudItem, !status && styles.crudItemDisabled]} onPress={() => handleToggleIco("delete")}>
          <FontAwesome6 name="trash" size={20} color="black" />
        </Pressable>
        <Pressable disabled={!status} style={[styles.crudItem, !status && styles.crudItemDisabled]} onPress={() => handleToggleIco("edit")}>
          <FontAwesome6 name="pen-clip" size={20} color="black" />
        </Pressable>
        <Pressable disabled={!status} style={[styles.crudItem, !status && styles.crudItemDisabled]} onPress={() => router.navigate("/visitantes/registrar")}>
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
          handleDelete={handleDeleteVisitor}
        />
      </ScrollView>

      {showVisitor && selectedVisitor && <VisitorModal visitor={selectedVisitor} handleCloseModal={handleCloseUserModal} />}
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

export default AdministracionVisitantes;
