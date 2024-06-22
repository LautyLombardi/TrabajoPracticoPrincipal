import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Alert, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import SelectItem from "@/components/seleccionar/SelectItem";
import { Ionicons } from "@expo/vector-icons";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import { Categoria, Rol, Visitante } from "@/api/model/interfaces";
import useEditLogUserVisitorFail from "@/hooks/logs/useInsertEditLogAdmUserVisitoFail";
import useInsertEditUserVisitor from "@/hooks/logs/useInsertEditLogAdmUserVisitor";
import useGetCategories from "@/hooks/category/useGetCategories";
import useGetVisitor from "@/hooks/visitor/useGetVisitor";
import useEditVisitor from "@/hooks/visitor/useEditVisitor";
import CampoFecha from "@/components/CampoFecha/CampoFecha";


const EditarVisitante = () => {
    const { dni } = useLocalSearchParams();
    const getVisitor = useGetVisitor();
    const [visitorByid , setVisitorByid] =  useState<Visitante>();
  
  
    useEffect(() => {
      const fetchVisitor = async () => {
        console.log("DNI antes de hacer el getVisitor" , dni)
        const visitor = await getVisitor(Number(dni));
        console.log("visitor atravez de by id" , visitor)
        if (visitor) {
          setNombreN(visitor.name);
          setApellidoN(visitor.lastname);
        // setCategorySeleccionadoName(visitor.category);
          setEmailN(visitor.email)
          setVisitorByid(visitor)
          setDniN(visitor.dni.toString())
        }
      }
        fetchVisitor();
      }, [dni, getVisitor]);


  
    const categoryDB = useGetCategories();
    const editVisitor = useEditVisitor();
    const insertLogEditVisitor = useInsertEditUserVisitor();
    const insertLogAdmEditVisitorFail = useEditLogUserVisitorFail();;
    const [nombreN, setNombreN] = useState("");
    const [apellidoN, setApellidoN] = useState("");
    const [dniN, setDniN] = useState("");
    const [emailN, setEmailN] = useState("");
    const [dateActive, setDateActive] = useState(new Date());
    const [categoria, setCategory] = useState<Categoria[]>([]);
    const [categoryName, setCategoryName] = useState<string[]>([]);
    const [CategorySeleccionadoName, setCategorySeleccionadoName] = useState<string>("");
  
  
    const handleTerminar = async () => {
     /* var categoryID : number | undefined = 0;
      if(CategorySeleccionadoName !==undefined){
        console.log('handler category')
        const category = categoria.find((category: { name: string }) =>
            category.name.trim().toLowerCase() === CategorySeleccionadoName.trim().toLowerCase()
        );
        categoryID = category?.id
      }
  */
      if (visitorByid) {
        const edit = await editVisitor(visitorByid, parseInt(dniN), nombreN, apellidoN, emailN);
        if (edit !== 0) {
          await insertLogEditVisitor( "visitante",parseInt(dniN));
          Alert.alert(
            "visitante modificado",
            "",
            [
              { text: "OK", onPress: () => router.navigate("/visitantes") }
            ]
          );
        } else {
          await insertLogAdmEditVisitorFail( "visitante", parseInt(dniN));
          Alert.alert("Error al guardar visitante");
        }
      } else {
        await insertLogAdmEditVisitorFail( "visitante", parseInt(dniN));
        Alert.alert("Error al guardar visitante");
      }
  
    };
/*
    useEffect(() => {
      const { categories } = categoryDB;
  
      if (categories && categories !== categoria) {
        setCategory(categories);
        const nombresCategorias = categories.map(categoria => categoria.name);
        setCategoryName(nombresCategorias);
      }
    }, [categoryDB, categoria]);
  */
  return (
    <View style={styles.container}>
      <HandleGoBackReg title="Editar Visitante" route="visitantes" />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Nombre:</Text>
          <TextInput
            style={styles.input}
            placeholder="Jose"
            placeholderTextColor="gray"
            onChangeText={setNombreN}
            value={nombreN}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Apellido:</Text>
          <TextInput
            style={styles.input}
            placeholder="Perez"
            placeholderTextColor="gray"
            onChangeText={setApellidoN}
            value={apellidoN}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>DNI: </Text>
          <TextInput
            style={styles.input}
            placeholder="00000000"
            placeholderTextColor="gray"
            onChangeText={setDniN}
            value={dniN}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="gray"
            onChangeText={setEmailN}
            value={emailN}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Fecha de Activacion:</Text>
          <View style={{ flex: 1 }}>
            <CampoFecha date={dateActive} setDate={setDateActive} />
          </View>
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

export default EditarVisitante;
