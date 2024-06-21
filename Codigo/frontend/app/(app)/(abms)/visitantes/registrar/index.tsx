import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, ScrollView, Alert, Pressable } from "react-native";
import { router } from "expo-router";
import CampoFecha from "@/components/CampoFecha/CampoFecha";
import SelectItem from "@/components/seleccionar/SelectItem";
import { Categoria, Empresa, Instituto } from "@/api/model/interfaces";
import HandleGoBackReg from "@/components/handleGoBack/HandleGoBackReg";
import useGetVisitorRigisterData from "@/hooks/visitor/useGetVisitorRigisterData";
import useInsertVisitor from "@/hooks/visitor/useInsertVisitor";
import useInsertLogAdm from "@/hooks/logs/userInsertLogAdm";
import useInsertLogAdmFail from "@/hooks/logs/userInsertLogAdmFail";

const RegistroVisitante = () => {
  const insertVisitor = useInsertVisitor()
  const visitorRigisterDataDB = useGetVisitorRigisterData()
  const insertLogAdm= useInsertLogAdm()
  const insertLogAdmFail= useInsertLogAdmFail()


  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [dateIngreso, setDateIngreso] = useState(new Date());
  const [categoriasName, setCategoriasName] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionadaName, setCategoriaSeleccionadaName] = useState<string>('');
  const [empresasName, setEmpresasName] = useState<string[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaSeleccionadaName, setEmpresaSeleccionadaName] = useState<string>('');
  const [institutosName, setInstitutosName] = useState<string[]>([]);
  const [institutos, setInstitutos] = useState<Instituto[]>([]);
  const [institutoSeleccionadoName, setInstitutoSeleccionadoName] = useState<string>('');
  const [isExtern, setIsExtern] = useState<number | null>(null);

  const handleTerminar = async () => {
    try {
      const empresa = empresas.find(empresa => empresa.name.trim().toLowerCase() === empresaSeleccionadaName.trim().toLowerCase());
      const categoria = categorias.find(categoria => categoria.name.trim().toLowerCase() === categoriaSeleccionadaName.trim().toLowerCase());
      const instituto = institutos.find(instituto => instituto.name.trim().toLowerCase() === institutoSeleccionadoName.trim().toLowerCase());

      if(categoria && nombre && apellido && dni && email && dateIngreso ){
        const insert = await insertVisitor(nombre, apellido, parseInt(dni), email, dateIngreso.toISOString(), categoria, empresa?.id || 0, instituto?.id || 0)
        if (insert === 0) {
          const log= await insertLogAdmFail("ALTA","visitante")
          Alert.alert("Error al guardar visitante");
        } else {
          const log= await insertLogAdm("ALTA","visitante")
          Alert.alert(
            "Visitante guardado",
            "",
            [
              { text: "OK", onPress: () => router.navigate("/visitantes") }
            ]
          );
        }
      }
      else if (!apellido) {
        await insertLogAdmFail("ALTA", "visitante");
        Alert.alert("Error al crear visitante","Se debe ingresar un apellido para el visitante")
      } else if (!email) {
        await insertLogAdmFail("ALTA", "visitante");
        Alert.alert("Error al crear visitante","Se debe ingresar un email para el visitante");
      } else if (!nombre) {
        await insertLogAdmFail("ALTA", "visitante");
        Alert.alert("Error al crear visitante","Se debe ingresar un nombre para el visitante");
      } else if (!dni) {
        await insertLogAdmFail("ALTA", "visitante");
        Alert.alert("Error al crear visitante","Se debe ingresar un dni para el visitante");
      } else if (!dateIngreso) {
        await insertLogAdmFail("ALTA", "visitante");
        Alert.alert("Error al crear visitante","Se debe ingresar una fecha de ingreso para el visitante");    
      } else {
        Alert.alert("Categoria  no encontrada.");
      }

    } catch (error) {
      console.error("Error en createVisitante:", error);
    }
  };

  useEffect(() => {
    const { categories, institutes, enterprices } = visitorRigisterDataDB;

    if (categories && categories !== categorias) {
      setCategorias(categories);
      const nombresCategorias = categories.map(categoria => categoria.name);
      setCategoriasName(nombresCategorias);
    }

    if (institutes && institutes !== institutos) {
      setInstitutos(institutes);
      const nombresInstitutos = institutes.map(instituto => instituto.name);
      setInstitutosName(nombresInstitutos);
    }

    if (enterprices && enterprices !== empresas) {
      setEmpresas(enterprices);
      const nombresEmpresas = enterprices.map(empresa => empresa.name);
      setEmpresasName(nombresEmpresas);
    }
  }, [visitorRigisterDataDB, categorias, institutos, empresas]);

  useEffect(() => {
    const selectedCategory = categorias.find(categoria => categoria.name.trim().toLowerCase() === categoriaSeleccionadaName);
    if (selectedCategory) {
      setIsExtern(selectedCategory.isExtern);
    } 
  }, [categoriaSeleccionadaName, categorias , isExtern]);
  
  return (
    <View style={styles.container}>
      {<HandleGoBackReg title='Registro Visitante' route='visitantes' />}
        
      <ScrollView style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Nombre:</Text>
          <TextInput
            style={styles.input}
            placeholder='Jose'
            placeholderTextColor="gray"
            onChangeText={setNombre}
            value={nombre}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Apellido:</Text>
          <TextInput
            style={styles.input}
            placeholder='Perez'
            placeholderTextColor="gray"
            onChangeText={setApellido}
            value={apellido}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>DNI: </Text>
          <TextInput
            style={styles.input}
            placeholder='00000000'
            placeholderTextColor="gray"
            onChangeText={setDni}
            value={dni}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder='example@example.com'
            placeholderTextColor="gray"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <SelectItem
            fieldName="Categoria"
            value={categoriaSeleccionadaName}
            onValueChange={setCategoriaSeleccionadaName}
            values={categoriasName}
          />
        </View>
        {isExtern === 1 ? (
          <View style={styles.inputContainer}>
            <SelectItem
              fieldName="Empresa"
              value={empresaSeleccionadaName}
              onValueChange={setEmpresaSeleccionadaName}
              values={empresasName}
            />
          </View>          
        ) : (
          <View style={styles.inputContainer}>
            <SelectItem
              fieldName="Institutos"
              value={institutoSeleccionadoName}
              onValueChange={setInstitutoSeleccionadoName}
              values={institutosName}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Fecha Incio en la UNGS:</Text>
          <View style={{ flex: 1 }}>
            <CampoFecha date={dateIngreso} setDate={setDateIngreso} />
          </View>
        </View>
      </ScrollView>
      
      <Pressable onPress={handleTerminar} style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
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
    fontSize: 15,
    textAlign: "left",
    width: "30%",
    marginRight: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    flex: 1,
    borderRadius: 5,
    color: 'black',
    justifyContent: 'center',
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
});

export default RegistroVisitante;
