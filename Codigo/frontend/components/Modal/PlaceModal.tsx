import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Lugar } from '@/api/model/interfaces';

interface ModalProps {
    place: Lugar;
    handleCloseModal: () => void;
}

const PlaceModal: React.FC<ModalProps> = ({ place, handleCloseModal }) => {
    const renderFields = () => {
        const fields = [
        { label: 'ID', value: place.id },
        { label: 'Nombre', value: place.name },
        { label: 'Abreviación', value: place.abbreviation },
        { label: 'Descripción', value: place.description },
        { label: 'Hora de Apertura', value: place.openTime },
        { label: 'Hora de Cierre', value: place.closeTime },
        { label: 'Activo', value: place.isActive === 1 ? 'SI' : 'NO' },
        { label: 'Fecha de Creación', value: place.createDate },
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
                size={30}
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

export default PlaceModal;
