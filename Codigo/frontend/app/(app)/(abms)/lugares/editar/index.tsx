import CampoFecha from "@/components/CampoFecha/CampoFecha";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import useEditPlace from "@/hooks/place/useEditPlaces";
import useGetPlace from "@/hooks/place/useGetPlace";
import useGetPlaces from "@/hooks/place/useGetPlaces";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const EditPlace = () => {
    const { id } = useLocalSearchParams();
    const { place, isLoading, isError } = useGetPlace(Number(id));
    const { places } = useGetPlaces();

    const [name, setName] = useState("");
    const [abbreviation, setAbbreviation] = useState("");
    const [description, setDescription] = useState("");
    const [openTime, setOpenTime] = useState("");
    const [closeTime, setCloseTime] = useState("");

    useEffect(() => {
        if (place) {
            setName(place.name);
            setAbbreviation(place.abbreviation);
            setDescription(place.description);
            setOpenTime(place.openTime);
            setCloseTime(place.closeTime);
        }
    }, [place]);

    const editPlace = useEditPlace();

    const handleTerminar = async () => {
        if (place) {
            const response = await editPlace(Number(id), name, abbreviation, description, openTime, closeTime);
            if (response !== 0) {
                Alert.alert("Place modificado", "", [
                    { text: "OK", onPress: () => router.navigate("/lugares") }
                ]);
            } else {
                Alert.alert("Error al guardar place");
            }
        } else {
            Alert.alert("Error completo al guardar place");
        }
    };

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (isError) {
        return <Text>Error: {isError}</Text>;
    }

    return (
        <View style={styles.container}>
            <HandleGoBackReg title="Editar Visitante" route="visitantes" />

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Nombre:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="modulo x"
                        placeholderTextColor="gray"
                        onChangeText={setName}
                        value={name}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Abreviatura:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="mod x"
                        placeholderTextColor="gray"
                        onChangeText={setAbbreviation}
                        value={abbreviation}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Descripción:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="descripcion"
                        placeholderTextColor="gray"
                        onChangeText={setDescription}
                        value={description}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Hora de apertura:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="10:10"
                        placeholderTextColor="gray"
                        onChangeText={setOpenTime}
                        value={openTime}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Hora de cierre:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="20:10"
                        placeholderTextColor="gray"
                        onChangeText={setCloseTime}
                        value={closeTime}
                    />
                </View>
            </View>

            <Pressable onPress={handleTerminar} style={styles.button}>
                <Text style={styles.buttonText}>Editar</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#00759c",
        flex: 1,
        paddingVertical: 30,
        alignItems: "center",
    },
    formContainer: {
        flex: 1,
        marginTop: 20,
        width: '90%',
    },
    inputContainer: {
        height: 70,
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 20,
    },
    labelText: {
        color: "white",
        fontSize: 16,
        textAlign: "left",
        width: "30%",
    },
    input: {
        backgroundColor: "white",
        padding: 10,
        flex: 1,
        borderRadius: 5,
        color: 'black',
    },
    passwordContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
    },
    inputPassword: {
        flex: 1,
        padding: 10,
        color: 'black',
    },
    icon: {
        marginRight: 5,
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '90%',
    },
    buttonText: {
        color: '#000051',
        fontSize: 16,
    },
});

export default EditPlace;
