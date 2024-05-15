import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ModalProps<T> {
  objeto: string[] | {} ;
  handleCloseModal: () => void;
}

const VisitorModal = <T,>({ objeto, handleCloseModal }: ModalProps<T>) => {
  const renderFields = () => {
    return Object.entries(objeto).map(([key, value], index) => (
      <UserInfo key={index} label={key} value={value.toString()} />
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
      <Text style={{ color: "white", fontSize: 14 }}>{label}</Text>
      <Text style={{ color: "white", fontSize: 14 }}>{value}</Text>
    </View>
  );
};

export default VisitorModal;
