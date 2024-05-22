import { View, Text } from 'react-native';
import React from 'react';
import Row from './Row';
import Col from './Col';
import { Ionicons } from '@expo/vector-icons';
import { DataRow } from '@/types/DataRow';

type PropsTable = {
  columns: string[];
  data: DataRow[];
  viewState: boolean;
  editState: boolean;
  deleteState: boolean;

  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;

  handleView?: () => void | null;
  handleEdit?: () => void | null;
  handleDelete?: () => void | null;
};

const Table: React.FC<PropsTable> = ({
  columns,
  data,
  viewState = true,
  editState = false,
  deleteState = false,
  showView = true,
  showEdit = false,
  showDelete = false,
  handleView = null,
  handleEdit = null,
  handleDelete = null
}) => {

  const iconVerMas = () => {
    return (
      <>
        {showView && (
          <Ionicons
            name="eye-outline"
            style={{ fontSize: 20, backgroundColor: "black", padding: 7, borderRadius: 100 }}
            color={"white"}
            onPress={handleView || undefined}
          />
        )}
      </>
    );
  };

  const deleteIcon = () => {
    return (
      <>
        {showDelete && (
          <Ionicons
            name="trash"
            style={{ fontSize: 20, padding: 7, borderRadius: 100 }}
            color={"red"}
            onPress={handleDelete || undefined}
          />
        )}
      </>
    );
  };

  const modifyIcon = () => {
    return (
      <>
        {showEdit && (
          <Ionicons
            name="pencil-sharp"
            style={{ fontSize: 20, padding: 7, borderRadius: 100 }}
            color={"orange"}
            onPress={handleEdit || undefined}
          />
        )}
      </>
    );
  };

  const handleToggleIcon = (): JSX.Element => {
    if (editState) {
      return modifyIcon();
    } else if (deleteState) {
      return deleteIcon();
    } else {
      return (
        <>
          {viewState ? iconVerMas() : null}
        </>
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
      <Row>
        {columns.map((column) => (
          <Col key={column} text={column} flexWidth={column === "ID" ? 0.8 : 3} />
        ))}
        <Col text="" flexWidth={0.8} />
      </Row>
      {data.map((item) => (
        <Row key={item.id}>
          {columns.map((column) => (
            <Col key={`${item.id}-${column}`} text={item[column]} flexWidth={column === "ID" ? 0.8 : 3} />
          ))}
          <Col flexWidth={0.8} icon={handleToggleIcon()} />
        </Row>
      ))}
    </View>
  );
};

export default Table;
