import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import CampoFecha from "@/components/CampoFecha/CampoFecha";
import Boton from "@/ui/Boton";
import SelectItem from "@/components/seleccionar/SelectItem";
import LugaresCheckBox from "@/components/lugaresCheckBox/LugaresCheckBox";
import SeleccionarImagen from "@/components/pickers/SeleccionarImagen";
import Header from "@/ui/Header";
import { createVisitante } from "@/api/services/visitantes";
import { obtenerCategorias } from "@/api/services/categorias";
import { Categoria } from "@/api/model/interfaces";

const empresas = ["COCA", "PEPSI", "BIMBO"];
const institutos = ["ICI", "IDEI", "PAPU"];

const RegistroVisitante = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [dateIngreso, setDateIngreso] = useState(new Date());
  const [dateEgreso, setDateEgreso] = useState(new Date());
  const [categoriasName, setCategoriasName] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionadaName, setCategoriaSeleccionadaName] = useState<string>('');
  const [instituto, setInstituto] = useState("");
  const [empresa, setEmpresa] = useState("");

  const [showNext, setShowNext] = useState(false);

  // Segunda parte
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState<string[]>([]);
  const ejemploLugares = ["2222", "mod3", "mod7"];
  const [imagen, setImagen] = useState<any>(null);

  // Route
  const handleGoBack = () => {
    const canGoBack = router.canGoBack();
    if (canGoBack) {
      router.back();
    } else {
      router.navigate("/visitantes");
    }
  };

  const handleContinuar = () => {
    setShowNext(true);
  };

  const handleRetroceder = () => {
    setShowNext(false);
  };

  const handleTerminar = async () => {
    try {
      await createVisitante(parseInt(dni), nombre, apellido, email, dateIngreso, dateEgreso);
      // TODO: implementar category
      console.log(categorias)
      
      router.navigate("/visitantes");
    } catch (error) {
      console.error("Error en createVisitante:", error);
    }
  };

  const handleLugarToggle = (lugar: string) => {
    const isSelected = lugaresSeleccionados.includes(lugar);
    if (isSelected) {
      setLugaresSeleccionados(lugaresSeleccionados.filter((item) => item !== lugar));
    } else {
      setLugaresSeleccionados([...lugaresSeleccionados, lugar]);
    }
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasData = await obtenerCategorias();
        setCategorias(categoriasData)
        const nombresCategorias = categoriasData.map(categoria => categoria.name);
        setCategoriasName(nombresCategorias);
         // Establecer el estado con los datos obtenidos
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategorias();
  }, [])
  
  return (
    <View style={{ backgroundColor: "#000051", flex: 1, alignItems: "center" }}>
      {/** HEADER */}
      <Header title="Registro Visitante" handleGoBack={handleGoBack} />

      {!showNext ? (
        <>
          <View style={{ flex: 1, marginTop: 20 }}>
            <View style={{height: 70, alignItems: "center",flexDirection: "row", gap: 10,}}>
              <View style={{ width: "23%" }}>
                <Text style={{ color: "white", fontSize: 15, textAlign: "center", textAlignVertical: "center" }}>Nombre</Text>
              </View>
              <View style={{ backgroundColor: "white",padding: 12,flex: 1,borderRadius: 5,marginRight: 10}}>
                <TextInput placeholder='Jose' placeholderTextColor={"gray"} onChangeText={setNombre} value={nombre}/>
              </View>
            </View>
            <View style={{height: 70, alignItems: "center",flexDirection: "row", gap: 10,}}>
              <View style={{ width: "23%" }}>
                <Text style={{ color: "white", fontSize: 15, textAlign: "center", textAlignVertical: "center" }}>Apellido</Text>
              </View>
              <View style={{ backgroundColor: "white",padding: 12,flex: 1,borderRadius: 5,marginRight: 10}}>
                <TextInput placeholder='Perez' placeholderTextColor={"gray"} onChangeText={setApellido} value={apellido}/>
              </View>
            </View>
            <View style={{height: 70, alignItems: "center",flexDirection: "row", gap: 10,}}>
              <View style={{ width: "23%" }}>
                <Text style={{ color: "white", fontSize: 15, textAlign: "center", textAlignVertical: "center" }}>DNI</Text>
              </View>
              <View style={{ backgroundColor: "white",padding: 12,flex: 1,borderRadius: 5,marginRight: 10}}>
                <TextInput placeholder='00000000' placeholderTextColor={"gray"} onChangeText={setDni} value={dni} keyboardType="numeric"/>
              </View>
            </View>
            <View style={{height: 70, alignItems: "center",flexDirection: "row", gap: 10,}}>
              <View style={{ width: "23%" }}>
                <Text style={{ color: "white", fontSize: 15, textAlign: "center", textAlignVertical: "center" }}>Email</Text>
              </View>
              <View style={{ backgroundColor: "white",padding: 12,flex: 1,borderRadius: 5,marginRight: 10}}>
                <TextInput placeholder='example@example.com' placeholderTextColor={"gray"} onChangeText={setEmail} value={email} keyboardType="email-address"/>
              </View>
            </View>
            
            {/** Seleccionar la categoria */}
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", padding: 10, gap: 10 }}>
              <SelectItem
                fieldName="Categoria"
                value={categoriaSeleccionadaName}
                onValueChange={setCategoriaSeleccionadaName}
                values={categoriasName}
              />
            </View>

            {/** Si es un visitante interno , se mostrara las opciones de institutos.
             * De ser un visitante externo, se le mostrara las opciones de Empresas */}

            {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                padding: 10,
                gap: 10,
              }}
            >
              {categoria == "interno" ? (
                <> */}
                  {/** Institutos */}
                  {/* <SelectItem
                    fieldName="Instituto"
                    value={instituto}
                    onValueChange={setInstituto}
                    values={institutos}
                  />
                </>
              ) : (
                <> */}
                  {/** Empresas */}
                  {/* <SelectItem
                    fieldName="Empresa"
                    value={empresa}
                    onValueChange={setEmpresa}
                    values={empresas}
                  />
                </>
              )}
            </View> */}

            {/** Fecha de Ingreso*/}
            <View style={{flexDirection: "row", alignItems: "center", width: "100%", padding: 10, }}>
              <View style={{ width: "25%" }}>
                <Text style={{ color: "white", fontSize: 15, textAlign: "center", textAlignVertical: "center" }}>
                  Fecha de Ingreso:{" "}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <CampoFecha date={dateIngreso} setDate={setDateIngreso} />
              </View>
            </View>

            {/** Fecha de Egreso */}
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", padding: 10, }}>
              <View style={{ width: "25%" }}>
                <Text style={{ color: "white", fontSize: 15, textAlign: "center", textAlignVertical: "center" }}>
                  Fecha de Egreso:{" "}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <CampoFecha date={dateEgreso} setDate={setDateEgreso} />
              </View>
            </View>

            <View style={{ alignSelf: "center" }}>
              <Boton
                backgroundColor="black"
                padding={20}
                text="Continuar"
                color="white"
                textAlign="center"
                fontSze={20}
                borderRadius={10}
                onPress={handleContinuar}
                style={{ width: 300, marginTop: 20 }}
              />
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={{ flex: 2, width: "100%", height: "100%" }}>
            {/** Subir archivo de Foto */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                gap: 10,
              }}
            >
              <SeleccionarImagen imagen={imagen} onChange={setImagen} />
            </View>

            {/** Seleccionar los lugares */}
            <View
              style={{
                width: "100%",
                justifyContent: "flex-start",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 15, color: "white" }}>
                  Lugares seleccionados: {lugaresSeleccionados.join(", ")}
                </Text>
              </View>
              <LugaresCheckBox
                lugares={ejemploLugares}
                lugaresSeleccionados={lugaresSeleccionados}
                onLugarToggle={handleLugarToggle}
              />
            </View>
          </View>

          {/** Botones de volver y continuar */}
          <View style={{ width: 300, gap: 10 }}>
            <Boton
              backgroundColor="#f56e1ad2"
              padding={20}
              text="Volver"
              color="white"
              textAlign="center"
              fontSze={20}
              borderRadius={10}
              onPress={handleRetroceder}
            />

            <Boton
              backgroundColor="black"
              padding={20}
              text="Continuar"
              color="white"
              textAlign="center"
              fontSze={20}
              borderRadius={10}
              onPress={handleTerminar}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default RegistroVisitante;