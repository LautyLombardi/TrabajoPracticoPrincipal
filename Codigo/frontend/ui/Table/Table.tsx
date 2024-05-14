import { View, Text } from 'react-native'
import React from 'react'
import Row from './Row';
import Col from './Col';

import { Ionicons } from '@expo/vector-icons';

type PropsTable = {
    viewState: boolean,
    editState: boolean,
    deleteState: boolean,

    showView?: boolean,
    showEdit?: boolean,
    showDelete?: boolean,
  };
  

const Table: React.FC<PropsTable> = ({ viewState, editState, deleteState, showView = true, showEdit = true, showDelete = true}) => {

    const iconVerMas = () => {
      return (<>
        {showView && <Ionicons name='eye-outline' style={{fontSize: 20, backgroundColor: "black", padding: 7, borderRadius: 100}} color={"white"}/> }
        </>)
    }
  
    const deleteIcon = () => {
      return (<>
        {showDelete && <Ionicons name='trash'  style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"red"}/>}
      </>)
    }
  
    const modifyIcon = () => {
      return (<>
        { showEdit && <Ionicons name='pencil-sharp'  style={{fontSize: 20, padding: 7, borderRadius: 100}} color={"orange"}/> }
        </>)
    }
    const handleToggleIcon = (): JSX.Element => {
      if (editState) {
        return modifyIcon();
      } else if (deleteState) {
        return deleteIcon();
      } else {
        return <></>;
      }
    };
  
    return (
      <View style={{ flex: 1, backgroundColor: 'transparent', height: '100%', width: '100%', paddingHorizontal: 10 }}>
        <Row>
          <Col text='ID'flexWidth={0.8}/>
          <Col text='Nombre' flexWidth={3}/>
          <Col text='' flexWidth={0.8}/>
        </Row>
        <Row>
          <Col text='1'flexWidth={0.8}/>
          <Col text='ICI' flexWidth={3}/>
          <Col flexWidth={0.8} icon={handleToggleIcon()}/>
        </Row>
        <Row>
          <Col text='2'flexWidth={0.8}/>
          <Col text='Lo de Victor' flexWidth={3}/>
          <Col flexWidth={0.8} icon={handleToggleIcon()}/>
        </Row>
        <Row>
          <Col text='3'flexWidth={0.8}/>
          <Col text='Plomeria SA' flexWidth={3}/>
          <Col flexWidth={0.8} icon={handleToggleIcon()}/>
        </Row>
      </View>
    );
  };
  

export default Table