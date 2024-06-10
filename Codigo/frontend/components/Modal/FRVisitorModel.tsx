import React from 'react';
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Visitante } from "@/api/model/interfaces";

interface ModalProps {
    visitor: Visitante;
    handleCloseModal: () => void;
}

const FRVisitorModel: React.FC<ModalProps> = ({ visitor, handleCloseModal }) => {
    const renderFields = () => {
        const fields = [
            { label: 'Dni', value: visitor.dni?.toString() },
            { label: 'Nombre', value: visitor.name },
            { label: 'Apellido', value: visitor.lastname },
            { label: 'Lugares', value: visitor.places?.join(', ') || '' }
        ];

        // Filtrar campos que no tienen valor
        const filteredFields = fields.filter(field => field.value !== '');

        return filteredFields.map((field, index) => (
            <UserInfo key={index} label={field.label} value={field.value} />
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

export default FRVisitorModel;
