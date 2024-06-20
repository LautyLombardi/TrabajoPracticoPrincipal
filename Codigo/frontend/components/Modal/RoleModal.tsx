import React from 'react'
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Rol } from '@/api/model/interfaces';

interface ModalProps {
    role: Rol;
    handleCloseModal: () => void;
}

const RoleModal: React.FC<ModalProps> = ({ role, handleCloseModal }) => {
    const renderFields = () => {
        const fields = [
        { label: 'ID', value: role.id },
        { label: 'Nombre', value: role.name },
        { label: 'Descripción', value: role.description },
        { label: 'Consfiguraciones del Sistema', value: role.routingConnection === 1 ? 'SI' : 'NO' },
        { label: 'Login Online', value: role.onlineLogin === 1 ? 'SI' : 'NO' },
        { label: 'Login Offline', value: role.offlineLogin === 1 ? 'SI' : 'NO' },
        { label: 'Apertura y Cierre del Día', value: role.dayStartEnd === 1 ? 'SI' : 'NO' },
        { label: 'Autenticación de Visitantes', value: role.visitorAuthentication === 1 ? 'SI' : 'NO' },
        { label: 'Autorización de Visitantes', value: role.visitorAuthorization === 1 ? 'SI' : 'NO' },
        { label: 'Configuración de Insitutos', value: role.instituteConfiguration === 1 ? 'SI' : 'NO' },
        { label: 'Manejo de Entidades', value: role.entityABMs === 1 ? 'SI' : 'NO' },
        { label: 'Reportes del Sistema', value: role.systemReports === 1 ? 'SI' : 'NO' },
        { label: 'Logs del Sistema', value: role.systemLog === 1 ? 'SI' : 'NO' },
        { label: 'Carga de Excepciones', value: role.exceptionLoading === 1 ? 'SI' : 'NO' },
        { label: 'Fecha de Creación', value: role.createDate },
        ];

        return fields.map((field, index) => (
        <UserInfo key={index} label={field.label} value={field.value.toString()} />
        ));
    };

    return (
        <View
        style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            height: "100%",
            width: "100%",
        }}
        >
        <View
            style={{
            backgroundColor: "#000",
            borderRadius: 10,
            padding: 20,
            width: "80%",
            }}
        >
            <ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Ionicons
                style={{ margin: 10, marginBottom: 20 }}
                name="close"
                size={20}
                onPress={handleCloseModal}
                color={"white"}
                />
            </View>
            {renderFields()}
            </ScrollView>
        </View>
        </View>
    );
};

interface InfoProps {
    label: string;
    value: string;
}

const UserInfo: React.FC<InfoProps> = ({ label, value }) => {
    return (
        <View
        style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomColor: "white",
            borderBottomWidth: 1,
            paddingBottom: 10,
            marginBottom: 10,
        }}
        >
        <Text style={{ color: "white", fontSize: 18, paddingLeft: 10 }}>{label}:</Text>
        <Text style={{ color: "white", fontSize: 18, paddingRight: 10 }}>{value}</Text>
        </View>
    );
};

export default RoleModal
