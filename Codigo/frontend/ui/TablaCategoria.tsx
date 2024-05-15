import { View } from 'react-native';
import React from 'react';
import Row from './Table/Row';
import Col from './Table/Col';
import { Ionicons } from '@expo/vector-icons';
import { Categoria } from '@/api/model/interfaces';

type PropsTable = {
  categorias: Categoria[];
  handleView: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
};

const CategoriaTable: React.FC<PropsTable> = ({
  categorias,
  handleView,
  handleEdit,
  handleDelete
}) => {
  return (
    <View>
      {/* Renderizar tabla de categorías aquí */}
    </View>
  );
};

export default CategoriaTable;
