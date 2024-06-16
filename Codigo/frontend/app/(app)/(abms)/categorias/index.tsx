import { View, Text, StyleSheet, Pressable, ScrollView, TextInput , TouchableOpacity,Switch } from 'react-native'
import React, { useEffect, useState, useCallback} from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Categoria, Rol } from '@/api/model/interfaces';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import CategoryModal from '@/components/Modal/CategoryModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useGetCategories from '@/hooks/category/useGetCategories';
import useActivateDesactive from '@/hooks/useActivateDesactive';
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
  categorias: Categoria[];
  viewState: boolean,
  editState: boolean,
  deleteState: boolean,

  handleView: (categoria: Categoria) => void;
  handleEdit: (id: number) => void;
  handleDelete: (category: Categoria) => void;
};

const Tablacategorias: React.FC<PropsTable> = ({ viewState, editState, deleteState, categorias, handleView,handleDelete }) => {


  const iconVerMas = (categoria: Categoria) => {
    return (
      <Ionicons name='eye-outline' style={{ fontSize: 32, padding: 7, borderRadius: 100 }} color={"white"} onPress={() => handleView(categoria)} />
    )
  }

  const deleteIcon = (categoria: Categoria) => {
    const isEnabled = categoria.isActive === 1;
    
    
    return (
      <Switch
        trackColor={{ false: '#F34C4C', true: '#27A418' }}
        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
        onValueChange={() => handleDelete(categoria)}
        value={isEnabled}
      />
    );
  }

  const modifyIcon = (id: number) => {
    return (
      <Ionicons name='pencil-sharp'
      style={{fontSize: 32, padding: 7, borderRadius: 100}} 
      color={"orange"} 
      onPress={() => router.push(`/categorias/editar?id=${id}`)}
      />
    )
  }
  const handleToggleIcon = (categoria: Categoria): JSX.Element => {
    if (editState) {
      return modifyIcon(categoria.id);
    } else if (deleteState) {
      return deleteIcon(categoria);
    } else {
      return iconVerMas(categoria);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
      <Row>
        <Col text='ID' flexWidth={0.8} />
        <Col text='Nombre' flexWidth={3} />
        <Col text='Descripcion' flexWidth={3} />
        <Col text='Externo' flexWidth={3} />
        <Col text='' flexWidth={1.5} />
      </Row>
      {categorias.map((categoria) => (
        <Row key={categoria.id}>
          <Col text={categoria.id?.toString() || ''} flexWidth={1.5} />
          <Col text={categoria.name} flexWidth={3} />
          <Col text={categoria.description} flexWidth={3} />
          <Col text={categoria.isExtern == 0 ? "No" : "Si"} flexWidth={3} />
          <Col flexWidth={1.5} icon={handleToggleIcon(categoria)} />
        </Row>
      ))}
    </View>
  );
};

const AdministracionCategorias = () => {
  const [status, setStatusDay] = useState<boolean>(true);
  const [permition, setPermition] = useState<Rol>();
  const [view, setView] = useState(true);
  const [edit, setEdit] = useState(false);
  const [trash, setTrash] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);

  const activateDesactive = useActivateDesactive();

  const handleOpenUserModal = (categoria: Categoria) => {
    setSelectedCategory(categoria);
    setShowCategory(true);
  };

  const handleCloseUserModal = () => {
    setSelectedCategory(null);
    setShowCategory(false);
  };

  // HandleDeleteCategoria 
  const handleDeleteCategoria = async (categori : Categoria) => {
    if (categori.isActive) {
      const result =  await activateDesactive(categori.id,'category',1);
      if (result !== 0) {
        console.log('Category deactivated successfully.');
        setCategorias(prevCategory => prevCategory.map(cat => 
          cat.id === categori.id ? { ...cat, isActive: 0 } : cat
        ))
      } else {
        console.error('Failed to deactivate category.');
      }
    } else {
      const result = await activateDesactive(categori.id,'category',0);
      if (result !== 0) {
        console.log('Category activated successfully.');
        setCategorias(prevCategory => prevCategory.map(cat => 
          cat.id === categori.id ? { ...cat, isActive: 1 } : cat
        ))
      } else {
        console.error('Failed to activate category.');
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

  // Listado de categorias
  const {categories, refetch} = useGetCategories()
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useFocusEffect(
    useCallback(() => {
      setEdit(false)
      setTrash(false)
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if(categories){
      setCategorias(categories);}
  }, [categories]);

  useEffect(() => {
    handlerDay();
  }, []);

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Administración de Categorías' route='menu' />

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
          onPress={() => router.navigate("/categorias/registrar")}>
          <FontAwesome6 name="plus" size={20} color="black" />
        </Pressable>
      </View>

      <ScrollView style={styles.tableContainer}>
        {/** Tabla */}
        <Tablacategorias
          viewState={view}
          editState={edit}
          deleteState={trash}
          categorias={categorias}
          handleView={handleOpenUserModal}
          handleEdit={() => console.log("editar")}
          handleDelete={handleDeleteCategoria}
        />
      </ScrollView>

      {showCategory && selectedCategory && <CategoryModal categoria={selectedCategory} handleCloseModal={handleCloseUserModal} />}

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

export default AdministracionCategorias