import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from "react-native";

export default function App() {
  const API = "http://localhost:4000/api/todos"; // Change to your server/ngrok URL
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  // Load todos from backend
  const loadTodos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.log("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setText("");
  };

  // Toggle done
  const toggleTodo = async (id, done) => {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !done }),
    });
    const updated = await res.json();
    setTodos(todos.map((t) => (t.id === id ? updated : t)));
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📌 Todo App</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Enter todo..."
          value={text}
          onChangeText={setText}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todo}>
            <TouchableOpacity onPress={() => toggleTodo(item.id, item.done)}>
              <Text style={[styles.todoText, item.done && styles.done]}>
                {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.delete}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7fafc", padding: 20, marginTop: 40 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  row: { flexDirection: "row", marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 8, marginRight: 8, borderRadius: 5 },
  todo: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  todoText: { fontSize: 18 },
  done: { textDecorationLine: "line-through", color: "gray" },
  delete: { color: "red", fontSize: 18 },
});
