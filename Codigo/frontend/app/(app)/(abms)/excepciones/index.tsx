import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import ContenedorVista from '@/ui/ContenedorVista'
import Boton from '@/components/Boton'
import { Ionicons } from '@expo/vector-icons'
import pickDate from '@/util/pickDate '
import { DropdownPicker } from '@/components/DropdownPicker'
import CheckboxList from '@/components/CheckboxList'
import { router } from 'expo-router'

// Funciones de ejemplo 

// Deberia ser cambiada por la funcion que devuelve todas las categorias
const obtenerCategorias = async () => {
  return [{
    id: 1,
    name: "Docente",
  },
  {
    id: 2,
    name: "Arquitecto",
  },
  {
    id: 3,
    name: "Pancho",
  },
  ]
}

// Deberia ser cambiada por l afuncion que devuelve todos los lugares
const obtenerLugares = async () => {
  return [{
    id: 1,
    name: "mod1"
  },
  {
    id: 2,
    name: "mod2"
  },
  {
    id: 3,
    name: "mod3"
  },
  {
    id: 4,
    name: "mod4"
  },
  {
    id: 5,
    name: "mod5"
  },
  {
    id: 6,
    name: "mod6"
  },
  {
    id: 7,
    name: "vicor cafeteria"
  },
  {
    id: 1,
    name: "modulo1"
  },
  ]
}

const excepciones = () => {

  // Manejo de las fechas de inicio y de cierre
  const [fechaInicio, setFechaInicio] = useState(new Date(Date.now()))
  const [fechaCierre, setFechaCierre] = useState(new Date(Date.now()))
  const handleFechaIncio = () => {
    pickDate(fechaInicio, setFechaInicio)
  }
  const handleFechaCierre = () => {
    pickDate(fechaCierre, setFechaCierre)
  }

  // Lista de las categorias disponibles
  const [listaCategorias, setLstaCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")

  useEffect(() => {
    obtenerCategorias().then((lista: any) => {
      setLstaCategorias(lista)
    }).catch(() => console.log("No se pudo cargar las categorias"))
  }, [])

  // Manejo de los lugares 
  const [listaDeLugares, setListaDeLugares] = useState([])
  const [lugaresSeleccionados, setLugaresSeleccionados] = useState([])

  useEffect(() => {
    obtenerLugares().then((lista: any) => { setListaDeLugares(lista) }).catch(() => console.log("No se pudo cargar los lugares"))
  }, [])

  const handleCambiosEnLugaresSeleccionados = (LugaresNuevos: any) => {
    setLugaresSeleccionados(LugaresNuevos)
  }

  // Terminar el registro de excepcion
  const enviarDatosAlBackend = async (datos?: any) => {
    console.log("datos enviados")
  }

  const handleTerminarRegistro = () => {
    enviarDatosAlBackend().then(() => {
      console.log("exito")
      router.navigate("/admin")
    }).catch(
      () => console.log("no exito")
    )
  }

  return (
    <ContenedorVista>
      {/* Formulario */}
      {/** Datos pedidos en la card:
       * Fecha de inicio de fin de la excepcion
       * Poder elegir lugares entre todos los disponibles en el sistema
       */}
      <View style={styles.formulario}>
        {/** Campo fecha de inicio */}
        <View style={styles.campo}>
          <Text style={styles.campoText}>Coloque la fecha de inicio</Text>
          <Boton styles={[styles.campoInput, { gap: 5 }]} onPress={handleFechaIncio}>
            <Text style={{ color: "black", fontSize: 15 }}>{fechaInicio.toLocaleDateString()}</Text>
            <Ionicons name='calendar' color={"black"} size={20} />
          </Boton>
        </View>

        {/** Campo fecha de Cierre */}
        <View style={styles.campo}>
          <Text style={styles.campoText}>Coloque la fecha de Cierre</Text>
          <Boton styles={[styles.campoInput, { gap: 5 }]} onPress={handleFechaCierre}>
            <Text style={{ color: "black", fontSize: 15 }}>{fechaCierre.toLocaleDateString()}</Text>
            <Ionicons name='calendar' color={"black"} size={20} />
          </Boton>
        </View>

        {/** Campo seleccionar  categoria afectada */}
        <View style={styles.campo}>
          <Text style={styles.campoText}>Selecione la Categoria</Text>
          <DropdownPicker style={styles.campoInput} itemList={listaCategorias} valor={categoriaSeleccionada} setValor={setCategoriaSeleccionada} />
        </View>

        {/** Selecionar los lugares a los que se le aplica la excepcion */}
        {/** Campo seleccionar  categoria afectada */}
        <View style={[styles.campo, {flexDirection: 'column', flex: 1, alignItems: "center"}]}>
          <Text style={[styles.campoText, {flex: 1}]}>Seleccionar los lugares a los que se le aplica la excepción</Text>
          {/* Renderizar el componente CheckboxList con la lista de lugares */}
          <CheckboxList
            items={listaDeLugares}
            checkedList={lugaresSeleccionados}
            onCheckboxChange={handleCambiosEnLugaresSeleccionados}
          />
          {/* Puedes usar lugaresSeleccionados para hacer algo con los lugares seleccionados */}
        </View>
      </View>

      {/** Enviar Excepcion al backend */}
      <View style={{flex: 1, justifyContent: "flex-end", padding: 40}}>
        <TouchableOpacity 
            style={{backgroundColor:"black", padding: 10, borderRadius: 10, borderColor:"white", borderWidth: 2}}
            onPress={handleTerminarRegistro}
          >
          <Text style={{width: 200, height: 30, color: "white", textAlign: "center", textAlignVertical: "center"}}>Registrar Excepcion</Text>
        </TouchableOpacity>
      </View>
    </ContenedorVista>
  )
}

const styles = StyleSheet.create({
  formulario: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  campo: {
    flexDirection: "row",
    gap: 20,
    padding: 5,
    alignItems: "center"
  },
  campoText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    flex: 1
  },
  campoInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 2,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10
  },
})

export default excepciones