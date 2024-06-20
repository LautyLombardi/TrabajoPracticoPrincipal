import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Rol } from '@/api/model/interfaces';
import HandleGoBack from '@/components/handleGoBack/HandleGoBack';
import RoleModal from '@/components/Modal/RoleModal';
import useGetRoles from '@/hooks/roles/useGetRoles';

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
  roles: Rol[]

  handleView: (rol: Rol) => void;
};

const TablaRoles: React.FC<PropsTable> = ({ roles, handleView }) => {

  const iconVerMas = (rol: Rol) => {
    return (
      <Ionicons name='eye-outline' style={{ fontSize: 20, padding: 7, borderRadius: 100 }} color={"white"} onPress={() => handleView(rol)} />
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
      <Row>
        <Col text='ID' flexWidth={0.8} />
        <Col text='Nombre' flexWidth={3} />
        <Col text='Descripcion' flexWidth={5} />
        <Col text='' flexWidth={1.5} />
      </Row>
      {roles.map((rol) =>
        <Row key={rol.id}>
          <Col text={rol.id ? rol.id.toString() : ''} flexWidth={1} />
          <Col text={rol.name} flexWidth={3} />
          <Col text={rol.description} flexWidth={5} />
          <Col flexWidth={1.5} icon={iconVerMas(rol)} />
        </Row>
      )}
    </View>
  );
};

const AdministracionRoles = () => {
  const [showRole, setShowRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Rol | null>(null);

  const handleOpenUserModal = (rol: Rol) => {
    setSelectedRole(rol);
    setShowRole(true);
  };

  const handleCloseUserModal = () => {
    setSelectedRole(null);
    setShowRole(false);
  };

  const rolesDB= useGetRoles();
  const [roles, setRoles] = useState<Rol[]>([])

  useEffect(() => {
    const { roles } = rolesDB
    if (roles) {
      setRoles(roles);
    }
  }, [rolesDB]);

  return (
    <View style={styles.container}>
      {/** Header Menu */}
      <HandleGoBack title='Administraion de Roles' route='menu' />
    
      {/** Tabla */}
      <ScrollView style={styles.tableContainer}>
        <TablaRoles
          roles={roles}
          handleView={handleOpenUserModal}
        />
      </ScrollView>

      {showRole && selectedRole && <RoleModal role={selectedRole} handleCloseModal={handleCloseUserModal} />}

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
    marginTop:'2%',
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

export default AdministracionRoles