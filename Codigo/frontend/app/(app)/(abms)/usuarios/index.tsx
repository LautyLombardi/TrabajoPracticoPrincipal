import { View, Text, StyleSheet, Pressable,TextInput, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import { Usuario } from '@/api/model/interfaces';
import { useFocusEffect } from '@react-navigation/native';
import { getUsuarios } from '@/api/services/user';


type PropsCol = {
  text?: string,
  flexWidth?: number,
  icon?: React.ReactNode
};

const Col: React.FC<PropsCol> = ({text, flexWidth = 1, icon}) => {

  const renderChildren = () => {
    if((text || text=='') && !icon){
      return (
      <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold', textAlign: "center", textAlignVertical: "center" }}>{text}</Text>
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
  handleShowUser: () => void,
};

const TablaUsuarios: React.FC<PropsTable> = ({ viewState, editState, deleteState, handleShowUser, usuarios }) => {

  const iconVerMas = (id: any) => {
    return (
      <Ionicons name='eye-outline' style={{fontSize: 20, backgroundColor: "black", padding: 7, borderRadius: 100}} color={"white"} />
    )
  }

  const deleteIcon = (id: any) => {
    return (
      <Ionicons name='trash'  style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"red"} />
    )
  }

  const modifyIcon = (id: any) => {
    return (
      <Ionicons name='pencil-sharp'  
        style={{fontSize: 20, padding: 7, borderRadius: 100}} 
        color={"orange"} 
      />
    )
  }
  const handleToggleIcon = (id: any): JSX.Element => {
    if (editState) {
      return modifyIcon(id);
    } else if (deleteState) {
      return deleteIcon(id);
    } else {
      return iconVerMas(id);
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
              <Col text={usuario.rol} flexWidth={3} />
              <View style={{ flex: 1.5, paddingVertical: 12, justifyContent: "center", alignItems: "center" }}>
              {handleToggleIcon(usuario.dni)}
          </View>
            </Row>
      )}
    </View>
  );
};

const AdministracionUsuarios = () => {
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);

  // Usuario Card
  const [showUser, setShowUser] = useState(false)

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
  const handleOpenUserModal = () => {
    setShowUser(true);
  };

  const handleCloseUserModal = () => {
    setShowUser(false);
  };

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useFocusEffect(
    useCallback(() => {
      getUsuarios().then((users) => setUsuarios(users))
    }, [])
  );

  useEffect(() => {
    getUsuarios().then((users) => setUsuarios(users))

  }, []);
  
  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Administraion de Usuarios' route='menu' />

      {/** Buscador */}
      <View style={{flexDirection: "row", alignItems: "center", width: "100%", marginTop: 20, paddingHorizontal: 10, gap: 8}}>
        <TextInput placeholder='Buscar' style={{backgroundColor: "white", color:"black", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, flex: 2, borderWidth: 1, borderColor: "black"}}/>
        <Ionicons name='search' color={"white"} style={{fontSize: 27, backgroundColor: "black", borderWidth: 1, borderColor: "white", borderRadius: 25, padding: 5}}/>
      </View>

      {/** Botones CRUD */}
      <View style={{flexDirection: "row", width: "100%", justifyContent: "flex-end", marginVertical: 15, alignItems: "center", paddingHorizontal: 20, gap: 5}}>
        <Pressable style={{padding: 10, backgroundColor: trash ? 'red' : 'black', borderRadius: 20}} onPress={() => handleToggleIco("delete")}>
          <Text style={{color: "white", fontSize: 10, fontWeight: 300}}>Dar de baja</Text>
        </Pressable>
        <Pressable style={{padding: 10, backgroundColor: edit? "orange" : "black", borderRadius: 20}} onPress={() => handleToggleIco("edit")}>
          <Text style={{color: "white", fontSize: 10, fontWeight: 300}}>Modificar</Text>
        </Pressable>
        <Pressable style={{padding: 10, backgroundColor: "black", borderRadius: 20}} onPress={() => router.navigate("/usuarios/registrar")}>
          <Text style={{color: "white", fontSize: 10, fontWeight: 300}}>Dar de alta</Text>
        </Pressable>
      </View>

      {/** Tabla */}
      <TablaUsuarios viewState={view} editState={edit} deleteState={trash} handleShowUser={handleOpenUserModal} usuarios={usuarios}/>


      {/* cosito del ojito, very important para S4 */}
      {/* {showUser && <VisitorModal usuario={visitantes} handleCloseModal={handleCloseUserModal} />} */}
      {/** Card User */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#000051',
      alignItems: 'center',
  },
});

export default AdministracionUsuarios