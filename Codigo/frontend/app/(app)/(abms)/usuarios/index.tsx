import { View, Text, StyleSheet, Pressable,TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { Usuario } from '@/api/model/interfaces';
import { useFocusEffect } from '@react-navigation/native';
import UserModal from '@/components/Modal/UserModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useGetUsers from "@/hooks/user/useGetUsers";

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
  usuarios: Usuario[]
  viewState: boolean,
  editState: boolean,
  deleteState: boolean,
  
  handleView: (usuario: Usuario) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
};

const TablaUsuarios: React.FC<PropsTable> = ({ viewState, editState, deleteState, usuarios, handleView}) => {

  const iconVerMas = (usuario: Usuario) => {
    return (
      <Ionicons name='eye-outline' style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"white"} onPress={() => handleView(usuario)} />
    )
  }

  const deleteIcon = (dni: any) => {
    return (
      <Ionicons name='trash'  style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"red"} />
    )
  }

  const modifyIcon = (dni: any) => {
    return (
      <Ionicons name='pencil-sharp'  
        style={{fontSize: 20, padding: 7, borderRadius: 100}} 
        color={"orange"} 
      />
    )
  }
  const handleToggleIcon = (usuario: Usuario): JSX.Element => {
    if (editState) {
      return modifyIcon(usuario.dni);
    } else if (deleteState) {
      return deleteIcon(usuario.dni);
    } else {
      return iconVerMas(usuario);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
      <Row>
        <Col text='DNI'flexWidth={3}/>
        <Col text='Nombre' flexWidth={3}/>
        <Col text='Apellido' flexWidth={3}/>
        <Col text='Rol' flexWidth={3}/>
        <Col text='' flexWidth={1.5}/>
      </Row>
      {usuarios.map((usuario) => 
        <Row key={usuario.dni} >
          <Col text={usuario.dni.toString()} flexWidth={3} />
          <Col text={usuario.name} flexWidth={3} />
          <Col text={usuario.lastname} flexWidth={3} />
          <Col text={usuario.rolName} flexWidth={3} />
          <Col flexWidth={1.5} icon={handleToggleIcon(usuario)} /> 
        </Row>
      )}
    </View>
  );
};

const AdministracionUsuarios = () => {
  const [status, setStatusDay] = useState<boolean>(true);
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  const handleOpenUserModal = (user: Usuario) => {
    setSelectedUser(user);
    setShowUser(true);
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setShowUser(false);
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
    const dayStatus = await AsyncStorage.getItem('dayStatus');
    const isDayOpen = dayStatus ? JSON.parse(dayStatus) : false;
    setStatusDay(isDayOpen)
  }

  const usersDB = useGetUsers();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useFocusEffect(
    useCallback(() => {
      const {users} = usersDB
      if (users) {
        setUsuarios(users);
      }      
    }, [[usersDB]])
  );

  useEffect(() => {
    const {users} = usersDB
    if (users) {
      setUsuarios(users);
    }  
  }, [usersDB]);
  
  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Administraion de Usuarios' route='menu' />

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
        <Pressable disabled={!status} style={[styles.crudItem, !status && styles.crudItemDisabled]} onPress={() => router.navigate("/usuarios/registrar")}>
          <FontAwesome6 name="plus" size={20} color="black" />
        </Pressable>
      </View>

      {/** Tabla */}
      <ScrollView style={styles.tableContainer}>
        <TablaUsuarios 
          viewState={view} 
          editState={edit} 
          deleteState={trash} 
          usuarios={usuarios}
          handleView={handleOpenUserModal}
          handleEdit={() => console.log("editar")} 
          handleDelete={() => console.log("borrar")}
        />
      </ScrollView>

      {showUser && selectedUser && <UserModal user={selectedUser} handleCloseModal={handleCloseUserModal} />}

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


export default AdministracionUsuarios