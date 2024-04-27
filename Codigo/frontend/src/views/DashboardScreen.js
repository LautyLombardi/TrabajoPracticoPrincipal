import * as React from "react";
import { View, StyleSheet, StatusBar, FlatList } from "react-native";
import DashboardRow from "../components/DashboardRow";

const DashboardScreen = () => {
  const [users, setUsers] = React.useState([
    { id: 1, name: "David Cañete" },
    { id: 2, name: "Lautaro Lombardi" },
    { id: 3, name: "Pato" },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <DashboardRow
            id={item.id}
            name={item.name}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <StatusBar backgroundColor="white" barStyle="dark-content" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  listContainer: {
    paddingHorizontal: 20,
  },
});

export default DashboardScreen;
