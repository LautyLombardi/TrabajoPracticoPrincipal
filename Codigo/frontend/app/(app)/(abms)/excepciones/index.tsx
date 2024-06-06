import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { Excepcion } from '@/api/model/interfaces';
import ExceptionModal from '@/components/Modal/ExceptionModal';
import useGetExceptions from '@/hooks/exception/useGetExceptions';

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
  excepciones: Excepcion[],
  viewState: boolean,
  editState: boolean,
  deleteState: boolean,
  handleView: (excepcion: Excepcion) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
};

const TablaExcepciones: React.FC<PropsTable> = ({ viewState, editState, deleteState, excepciones, handleView }) => {
  const iconVerMas = (excepcion: Excepcion) => {
    return (
      <Ionicons name='eye-outline' style={{ fontSize: 20, padding: 7, borderRadius: 100 }} color={"white"} onPress={() => handleView(excepcion)} />
    );
  };

  const deleteIcon = () => {
    return (
      <Ionicons name='trash' style={{ fontSize: 20, padding: 7, borderRadius: 100 }} color={"red"} />
    );
  };

  const modifyIcon = () => {
    return (
      <Ionicons name='pencil-sharp' style={{ fontSize: 20, padding: 7, borderRadius: 100 }} color={"orange"} />
    );
  };

  const handleToggleIcon = (excepcion: Excepcion): JSX.Element => {
    if (editState) {
      return modifyIcon();
    } else if (deleteState) {
      return deleteIcon();
    } else {
      return iconVerMas(excepcion);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
      <Row>
        <Col text='ID' flexWidth={2} />
        <Col text='Nombre' flexWidth={3} />
        <Col text='Descripción' flexWidth={5} />
        <Col text='Duración' flexWidth={2} />
        <Col text='Fecha Creación' flexWidth={3} />
        <Col text='Categoria' flexWidth={3} />
        <Col text='' flexWidth={1.5} />
      </Row>
      {excepciones.map((excepcion) =>
        <Row key={excepcion.id}>
          <Col text={excepcion.id.toString()} flexWidth={2} />
          <Col text={excepcion.name} flexWidth={3} />
          <Col text={excepcion.description} flexWidth={5} />
          <Col text={excepcion.duration} flexWidth={2} />
          <Col text={excepcion.createDate} flexWidth={3} />
          <Col text={excepcion.category_name} flexWidth={3} />
          <Col flexWidth={1.5} icon={handleToggleIcon(excepcion)} />
        </Row>
      )}
    </View>
  );
};

const AdministracionExcepciones = () => {
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);
  const [showException, setShowException] = useState(false);
  const [selectedException, setSelectedException] = useState<Excepcion | null>(null);

  const handleOpenExceptionModal = (excepcion: Excepcion) => {
    setSelectedException(excepcion);
    setShowException(true);
  };

  const handleCloseExceptionModal = () => {
    setSelectedException(null);
    setShowException(false);
  };

  function handleToggleIco(icon: string) {
    if (icon == "edit" && edit || icon == "delete" && trash) {
      setEdit(false)
      setTrash(false)
    } else {
      setEdit(icon == "edit")
      setTrash(icon == "delete")
    }
  };

  const exceptionsDB = useGetExceptions();
  const [excepciones, setExcepciones] = useState<Excepcion[]>([]);

  useFocusEffect(
    useCallback(() => {
      const { exceptions } = exceptionsDB;
      if (exceptions) {
        setExcepciones(exceptions);
      }
    }, [exceptionsDB])
  );

  useEffect(() => {
    const { exceptions } = exceptionsDB;
    if (exceptions) {
      setExcepciones(exceptions);
    }
  }, [exceptionsDB]);

  return (
    <View style={styles.container}>
      <HandleGoBack title='Administración de Excepciones' route='menu' />

      <View style={styles.searchContainer}>
        <TextInput placeholder='Buscar' style={styles.searchText} />
        <Pressable style={styles.searchButton}>
          <FontAwesome5 name='search' color={"black"} style={styles.searchButtonIcon} />
        </Pressable>
      </View>

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
        <Pressable style={styles.crudItem} onPress={() => router.navigate("/excepciones/registrar")}>
          <FontAwesome6 name="plus" size={20} color="black" />
        </Pressable>
      </View>

      <ScrollView style={styles.tableContainer}>
        <TablaExcepciones
          viewState={view}
          editState={edit}
          deleteState={trash}
          excepciones={excepciones}
          handleView={handleOpenExceptionModal}
          handleEdit={() => console.log("editar")}
          handleDelete={() => console.log("borrar")}
        />
      </ScrollView>

      {showException && selectedException && <ExceptionModal excepcion={selectedException} handleCloseModal={handleCloseExceptionModal} />}
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
    gap: 4,
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
    borderColor: "black",
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
  },
});

export default AdministracionExcepciones;
