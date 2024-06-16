import CampoFecha from "@/components/CampoFecha/CampoFecha";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import useInsertLogAdm from "@/hooks/logs/userInsertLogAdm";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import useInsertLogAdmFail from "@/hooks/logs/userInsertLogAdmFail";
import useEditPlace from "@/hooks/place/useEditPlaces";
import useGetPlace from "@/hooks/place/useGetPlace";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const EditPlace = () => {
    const { id } = useLocalSearchParams();
    const { place, isLoading, isError } = useGetPlace(Number(id));

    const [name, setName] = useState("");
    const [abbreviation, setAbbreviation] = useState("");
    const [description, setDescription] = useState("");
    const [openTime, setOpenTime] = useState("");
    const [closeTime, setCloseTime] = useState("");
    const [isOpenPickerVisible, setIsOpenPickerVisible] = useState<boolean>(false);
    const [isClosePickerVisible, setIsClosePickerVisible] = useState<boolean>(false);
    const insertLogAdm=useInsertLogAdm();
    const insertLogAdmFail=useInsertLogAdmFail();

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

    const handleConfirmOpenTime = (date: any) => {
        setOpenTime(date.toTimeString().slice(0, 5));
        setIsOpenPickerVisible(false);
    };

    const handleConfirmCloseTime = (date: any) => {
        setCloseTime(date.toTimeString().slice(0, 5));
        setIsClosePickerVisible(false);
    };
    const handleTerminar = async () => {
        if (!isValidTime(openTime) || !isValidTime(closeTime)) {
            Alert.alert("Formato de hora no válido", "El formato debe ser hh:mm");
            return;
          }
        
        if (place) {
            const response = await editPlace(Number(id), name, abbreviation, description, openTime, closeTime);
            if (response !== 0) {
                await insertLogAdm("MODIFICACION","lugares")
                Alert.alert("Place modificado", "", [
                    { text: "OK", onPress: () => router.navigate("/lugares") }
                ]);
            } else {
                await insertLogAdmFail("MODIFICACION","lugares")
                Alert.alert("Error al guardar place");
            }
        } else {
            await insertLogAdmFail("MODIFICACION","lugares")
            Alert.alert("Error completo al guardar place");
        }
    };

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (isError) {
        return <Text>Error: {isError}</Text>;
    }

    const isValidTime = (time: any) => {
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(time);
      };


    return (
        <View style={styles.container}>
            <HandleGoBackReg title="Editar Visitante" route="lugares" />

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
                    <Text style={styles.labelText}>Hora de Apertura:</Text>
                    <Pressable onPress={() => setIsOpenPickerVisible(true)} style={styles.input}>
                        <Text style={{ color: 'black' }}>{openTime || '08:00'}</Text>
                    </Pressable>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.labelText}>Hora de Cierre:</Text>
                    <Pressable onPress={() => setIsClosePickerVisible(true)} style={styles.input}>
                        <Text style={{ color: 'black' }}>{closeTime || '18:00'}</Text>
                    </Pressable>
                </View>
                   
                
            </View>

            <Pressable onPress={handleTerminar} style={styles.button}>
                <Text style={styles.buttonText}>Editar</Text>
            </Pressable>

            <DateTimePickerModal
                isVisible={isOpenPickerVisible}
                mode="time"
                onConfirm={handleConfirmOpenTime}
                onCancel={() => setIsOpenPickerVisible(false)}
                is24Hour={true}
             />

            <DateTimePickerModal
                isVisible={isClosePickerVisible}
                mode="time"
                onConfirm={handleConfirmCloseTime}
                onCancel={() => setIsClosePickerVisible(false)}
                is24Hour={true}
            />
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
