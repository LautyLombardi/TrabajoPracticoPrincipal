import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link, router, useNavigation } from 'expo-router';


const Menu = () => {

  return (
    <View style={styles.container}>
        {/** Header Menu */}
        <View style={{height: 50, backgroundColor: "white", width: "100%", justifyContent: "center", padding: 10}}>
            <Text style={{fontWeight: "bold"}}>
                Menu
            </Text>
        </View>

        {/** Menu */}
        <View style={styles.listBtns}>
            <View style={styles.row}>
                <View style={styles.col}>
                    <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/visitantes")}>
                        <Text style={styles.textBtnMenu}>Administración de Visitantes</Text>
                    </Pressable>
                </View>
                <View style={styles.col}>
                    <Pressable style={styles.buttonMenu} >
                        <Text style={styles.textBtnMenu}>Administración de Instituciones</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.col}>
                    <Pressable style={styles.buttonMenu}>
                        <Text style={styles.textBtnMenu}>Administración de Roles</Text>
                    </Pressable>
                </View>
                <View style={styles.col}>
                    <Pressable style={styles.buttonMenu} onPress={() => router.navigate("/categoria")}>
                        <Text style={styles.textBtnMenu}>Administración de Categorias</Text>
                    </Pressable>
                </View>
            </View>
        </View>

        {/** Boton de autenticar */}
        <View style={styles.bottomButton}>
            <Link href={"/autenticar"} asChild>
                <Pressable style={styles.button}>
                    <Text style={styles.text}>Autenticar</Text>
                </Pressable>
            </Link>
        </View>
        
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000051',
        alignItems: 'center',
    },

    // Menu de Botones
    listBtns: {
        flexDirection: 'column', 
        width: 350,
        marginTop: 40
    },
    row: {
        flexDirection: 'row',
    },
    col: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonMenu: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        margin: 5,
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 5 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 3, 
        elevation: 5, 
    },
    textBtnMenu: {
        color: '#000',
        textAlign: 'center',
    },

    // Botom de Autenticar
    bottomButton: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderTopWidth: 2,
        borderColor: "#000"
    },
    button: {
        backgroundColor: "#f1f1f1",
        width: "110%",
        padding: 20,
        borderRadius: 12,
    },
    text: {
        color: "#000",
        textAlign: "center",
        fontSize: 25
    },

});

export default Menu;
