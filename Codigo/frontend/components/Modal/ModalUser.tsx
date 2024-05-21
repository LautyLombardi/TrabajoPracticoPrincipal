import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Visitante {
  nombre: string;
  apellido: string;
  email: string;
  dni: number;
  categoria: string;
  lugares: string[];
}

interface ModalProps {
  usuario: Visitante;
  handleCloseModal: () => void;
}

const VisitorModal: React.FC<ModalProps> = ({ usuario, handleCloseModal }) => {
  return (
    <View
      style={{
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: "100%",
        width: "100%"
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
              name="close"
              size={20}
              onPress={handleCloseModal}
              color={"white"}
            />
          </View>
          <UserInfo label="Nombre:" value={usuario.nombre} />
          <UserInfo label="Apellido:" value={usuario.apellido} />
          <UserInfo label="Email:" value={usuario.email} />
          <UserInfo label="DNI:" value={usuario.dni.toString()} />
          <UserInfo label="Categoría:" value={usuario.categoria} />
          <UserInfo
            label="Lugares:"
            value={usuario.lugares.join(", ")}
            isLast
          />
        </ScrollView>
      </View>
    </View>
  );
};

interface InfoProps {
  label: string;
  value: string;
  isLast?: boolean;
}

const UserInfo: React.FC<InfoProps> = ({ label, value, isLast }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: isLast ? "transparent" : "white",
        borderBottomWidth: isLast ? 0 : 1,
        paddingBottom: isLast ? 0 : 10,
        marginBottom: isLast ? 0 : 10,
      }}
    >
      <Text style={{ color: "white", fontSize: 14 }}>{label}</Text>
      <Text style={{ color: "white", fontSize: 14 }}>{value}</Text>
    </View>
  );
};

export default VisitorModal;
