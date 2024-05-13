import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";

const CardRow = ({ campo = "Campo", valor = "Valor" }) => {
  return (
    <View
      style={{
        width: "100%",
        borderBottomWidth: 2,
        borderBottomColor: "white",
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 8,
      }}
    >
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>
          {campo}:{" "}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>
          {valor}
        </Text>
      </View>
    </View>
  );
};

const CardUser = () => {
  return (
    <View
      style={{
        backgroundColor: "#000",
        flex: 1,
        alignItems: "center",
        padding: 20,
        paddingTop: 60,
        borderTopWidth: 3,
        borderTopColor: "#1f41f2",
      }}
    >
      <CardRow campo="Nombre" valor="Juan Gabriel" />
      <CardRow campo="Apellido" valor="Castaño" />
      <CardRow campo="Categoria" valor="Docente" />
      <CardRow campo="Lugares" valor="Mod7, 3066" />
    </View>
  );
};

const AccesoNoPermitido = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 20,
        paddingTop: 60,
        borderTopWidth: 3,
        borderTopColor: "#fff",
        justifyContent: "center"
      }}
    >
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>
        Acceso no permitido
      </Text>
    </View>
  );
};

type AutorizadoState = boolean | null;

const AutenticarScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef();

  const [showCard, setShowCard] = useState(false);
  const [autorizado, setAutorizado] = useState<AutorizadoState>(null);
  const [user, setUser] = useState("");

  const handleAutenticacion = () => {
    setUser("JUAN");
    setShowCard(!showCard);
    setAutorizado(true)
  };

  if (!permission) {
    return (
      <View>
        <Text> CARGANDO </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>NO TIENES ACCESSO PELOTUDO</Text>
      </View>
    );
  }

  const renderBoton = () => {
    if (showCard && autorizado) {
      return (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            backgroundColor: "#000",
            height: "80%",
            width: "100%",
            padding: 0,
          }}
        >
          <CardUser />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "green",
                padding: 12,
                width: "90%",
                alignItems: "center",
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "white",
              }}
              onPress={handleAutenticacion}
            >
              <Text
                style={{ color: "white", fontSize: 25, fontWeight: "bold" }}
              >
                Continuar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      if (false) {
        return (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              backgroundColor: "#d13a3aa7",
              height: "80%",
              width: "100%",
              padding: 0,
            }}
          >
            <AccesoNoPermitido />
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                margin: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#ff2222",
                  padding: 12,
                  width: "90%",
                  alignItems: "center",
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: "#fff",
                }}
                onPress={handleAutenticacion}
              >
                <Text
                  style={{ color: "#fff", fontSize: 25, fontWeight: "bold" }}
                >
                  Continuar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      } else {
        return (
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
              onPress={() => handleAutenticacion()}
            >
              <Text style={styles.text}>Autenticar</Text>
            </Pressable>
          </View>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="front" ref={() => cameraRef} />
      {renderBoton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },

  button: {
    backgroundColor: "#000",
    width: "80%",
    padding: 20,
    borderRadius: 12,
    alignSelf: "center",
  },

  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 25,
  },

  // Camera
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default AutenticarScreen;
