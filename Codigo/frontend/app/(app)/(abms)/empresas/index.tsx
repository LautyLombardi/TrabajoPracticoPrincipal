import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { Empresa, Rol } from '@/api/model/interfaces';
import EnterpriceModal from '@/components/Modal/EnterpriceModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useGetEnterprices from '@/hooks/enterprice/useGetEnterprices';
import useDeactivateEnterprice from '@/hooks/enterprice/useDeactivateEnterprice';
import useActivateEnterprice from '@/hooks/enterprice/useActivateEnterprice';

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
  empresas: Empresa[];
  viewState: boolean,
  editState: boolean,
  deleteState: boolean

  handleView: (empresa: Empresa) => void;
  handleEdit: (id: number) => void;
  handleDelete: (enterprice: Empresa) => void;
};

const TablaEmpresa: React.FC<PropsTable> = ({ viewState, editState, deleteState, empresas, handleView, handleEdit, handleDelete }) => {

  const iconVerMas = (empresa: Empresa) => {
    return (
      <Ionicons name='eye-outline' style={{ fontSize: 20, padding: 7, borderRadius: 100 }} color={"white"} onPress={() => handleView(empresa)} />
    )
  }

  const deleteIcon = (enterprice: Empresa) => {
    return (
      <TouchableOpacity onPress={() => handleDelete(enterprice)}>
        <Ionicons name='trash' style={{ fontSize: 20, padding: 7, borderRadius: 100 }} color={"red"} />
      </TouchableOpacity>
    )
  }

  const modifyIcon = (id : number) => {
    return (
      <Ionicons name='pencil-sharp'  
      style={{fontSize: 20, padding: 7, borderRadius: 100}} 
      color={"orange"} 
      onPress={() => router.push(`/empresas/editar?id=${id}`)}
      />
    )
  }

  const handleToggleIcon = (empresa: Empresa): JSX.Element => {
    if (editState) {
      return modifyIcon(empresa.id);
    } else if (deleteState) {
      return deleteIcon(empresa);
    } else {
      return iconVerMas(empresa);
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
        empresas.map(empresa => (
          <Row key={empresa.id}>
            <Col text={empresa.id?.toString() || ''} flexWidth={0.8} />
            <Col text={empresa.name} flexWidth={3} />
            <Col text={empresa.cuit.toString()} flexWidth={3} />
            <Col flexWidth={1.5} icon={handleToggleIcon(empresa)} />
          </Row>
        ))
      }
    </View>
  );
};

const AdministracionEmpresas = () => {
  const [status, setStatusDay] = useState<boolean>(true);
  const [permition, setPermition] = useState<Rol>();
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);
  const [showEnterprice, setShowEnterprice] = useState(false);
  const [selectedEnterprice, setSelectedEnterprice] = useState<Empresa | null>(null);

  const deactivateEnterprice = useDeactivateEnterprice();
  const activateEnterprice = useActivateEnterprice();

  const handleOpenUserModal = (empresa: Empresa) => {
    setSelectedEnterprice(empresa);
    setShowEnterprice(true);
  };

  const handleCloseUserModal = () => {
    setSelectedEnterprice(null);
    setShowEnterprice(false);
  };

  const handleDeleteEnterprice = async (enterprice: Empresa) => {
    if (enterprice.isActive) {
      const result = await deactivateEnterprice(enterprice.id)
      if (result !== 0) {
        console.log('Enterprice deactivated successfully.');
        const handleInsts = empresas
        handleInsts.forEach(emp =>{
          if (emp.id === enterprice.id) {
            emp.isActive = 0
          }
        })
        setEmpresas(handleInsts)
      } else {
        console.error('Failed to deactivate enterprice.');
      }
    } else {
      const result = await activateEnterprice(enterprice.id);
      if (result !== 0) {
        console.log('Enterprice activated successfully.');
        const handleInsts = empresas
        handleInsts.forEach(emp =>{
          if (emp.id === enterprice.id) {
            emp.isActive = 1
          }
        })
        setEmpresas(handleInsts)
      } else {
        console.error('Failed to activate enterprice.');
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
  const {enterprices, refetch} = useGetEnterprices();
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if(enterprices){
      setEmpresas(enterprices);}
  }, [enterprices]);

  useEffect(() => {
    handlerDay();
  }, []);


  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Administración de Empresa' route='menu' />

      {/** Botones CRUD */}
      <View style={styles.crudBtn}>
        <Pressable
          disabled={!status || (permition ? permition?.entityABMs === 0 : true)}
          style={[styles.crudItem, (!status || (permition ? permition.entityABMs === 0 : true)) && styles.crudItemDisabled]}
          onPress={() => handleToggleIco("ver")}>
          <Ionicons name='eye-outline' size={20} color="black" />
        </Pressable>
        <Pressable
          disabled={!status || (permition ? permition?.entityABMs === 0 : true)}
          style={[styles.crudItem, (!status || (permition ? permition.entityABMs === 0 : true)) && styles.crudItemDisabled]}
          onPress={() => handleToggleIco("delete")}>
          <FontAwesome6 name="trash" size={20} color="black" />
        </Pressable>
        <Pressable
          disabled={!status || (permition ? permition?.entityABMs === 0 : true)}
          style={[styles.crudItem, (!status || (permition ? permition.entityABMs === 0 : true)) && styles.crudItemDisabled]}
          onPress={() => handleToggleIco("edit")}>
          <FontAwesome6 name="pen-clip" size={20} color="black" />
        </Pressable>
        <Pressable
          disabled={!status || (permition ? permition?.entityABMs === 0 : true)}
          style={[styles.crudItem, (!status || (permition ? permition.entityABMs === 0 : true)) && styles.crudItemDisabled]}
          onPress={() => router.navigate("/empresas/registrar")}>
          <FontAwesome6 name="plus" size={20} color="black" />
        </Pressable>
      </View>

      {/** Tabla */}
      <ScrollView style={styles.tableContainer}>
        <TablaEmpresa
          viewState={view}
          editState={edit}
          deleteState={trash}
          empresas={empresas}
          handleView={handleOpenUserModal}
          handleEdit={(id) => console.log("editar", id)}
          handleDelete={handleDeleteEnterprice}
        />
      </ScrollView>

      {showEnterprice && selectedEnterprice && <EnterpriceModal empresa={selectedEnterprice} handleCloseModal={handleCloseUserModal} />}

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

export default AdministracionEmpresas;
