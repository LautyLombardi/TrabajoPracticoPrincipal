import React from 'react'
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Categoria } from '@/api/model/interfaces';

interface ModalProps {
    categoria: Categoria;
    handleCloseModal: () => void;
}

const CategoryModal: React.FC<ModalProps> = ({ categoria, handleCloseModal }) => {
    const renderFields = () => {
        const fields = [
        { label: 'ID', value: categoria.id },
        { label: 'Nombre', value: categoria.name },
        { label: 'Descripción', value: categoria.description },
        { label: 'Externo', value: categoria.isExtern === 1 ? 'SI' : 'NO' },
        { label: 'Lugares', value: categoria.places?.join(', ') || '' },
        { label: 'Institutos', value: categoria.institutes?.join(', ') || '' },
        { label: 'Fecha de Creación', value: categoria.createDate },
        { label: 'Activa', value: categoria.isActive === 1 ? 'SI' : 'NO' },
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

export default CategoryModal
