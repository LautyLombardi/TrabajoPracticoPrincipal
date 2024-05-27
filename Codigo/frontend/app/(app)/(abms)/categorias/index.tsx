import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Categoria } from '@/api/model/interfaces';
import { obtenerCategorias } from '@/api/services/categorias';
import { desactivarCategoria } from '@/api/services/categorias';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';

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
  categorias: Categoria[];

  viewState: boolean,
  editState: boolean,
  deleteState: boolean,
  
  handleView: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
};

const Tablacategorias: React.FC<PropsTable> = ({ viewState, editState, deleteState, categorias }) => {

  const handleDesactivarCategoria = async (id: number) => {
    try {
      await desactivarCategoria(id);
      // Realizar cualquier otra acción necesaria después de desactivar la categoría
    } catch (error) {
      console.error('Error al desactivar la categoría:', error);
    }
  };

  const iconVerMas = (id: any) => {
    return (
      <Ionicons name='eye-outline' style={{fontSize: 20, backgroundColor: "black", padding: 7, borderRadius: 100}} color={"white"} />
    )
  }

  const deleteIcon = (id: any) => {
    return (

      <Ionicons name='trash'  style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"red"} onPress={() => handleDesactivarCategoria(id)}/>
    )
  }

  const modifyIcon = (id: any) => {
    return (
      <Ionicons name='pencil-sharp'  style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"orange"} />
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
        <Col text='ID'flexWidth={1.5}/>
        <Col text='Nombre' flexWidth={3}/>
        <Col text='Descripcion' flexWidth={3}/>
        <Col text='Externo' flexWidth={3}/>
        <Col text='fecha' flexWidth={4}/>
        <Col text='' flexWidth={0.8}/>
      </Row>
      {categorias.map((categoria) => (
        <Row key={categoria.id}>
          <Col text={categoria.id?.toString() || ''} flexWidth={1.5} />
          <Col text={categoria.name} flexWidth={3} />
          <Col text={categoria.description} flexWidth={3} />
          <Col text={categoria.isExtern==0? "No":"Si"} flexWidth={3} />
          <Col text={categoria.createDate} flexWidth={4} />
          {/* <Col flexWidth={0.8} icon={handleToggleIcon()} /> */} 
          {/** Icono de columna */}
          <View style={{ flex: 0.8, paddingVertical: 12, justifyContent: "center", alignItems: "center" }}>
              {handleToggleIcon(categoria.id)}
          </View>
        </Row>
      ))}
    </View>
  );
};

const AdministracionCategorias = () => {
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);

  // HandleDeleteCategoria 
  const handleDeleteCategoria = () => {

  }

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

  // Listado de categorias
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useFocusEffect(
    useCallback(() => {
      obtenerCategorias().then((categories) => setCategorias(categories))
    }, [])
  );

  useEffect(() => {
    obtenerCategorias().then((categories) => setCategorias(categories))

  }, []);

  return (
    <View style={styles.container}>
        {/** Header Menu */}
        <HandleGoBack title='Administración de Categorías' route='menu' />

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
          <Pressable style={{padding: 10, backgroundColor: "black", borderRadius: 20}} onPress={() => router.navigate("/categorias/registrar")}>
            <Text style={{color: "white", fontSize: 10, fontWeight: 300}}>Dar de alta</Text>
          </Pressable>
        </View>

        {/** Tabla */}
        <Tablacategorias viewState={view} editState={edit} deleteState={trash} categorias={categorias} handleView={()=> console.log("ver")} handleEdit={() => console.log("edutar")} handleDelete={handleDeleteCategoria}/>

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

export default AdministracionCategorias