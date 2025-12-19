import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { authenticateBiometric } from '@/hooks/useBiometricAuth';
import { useAuth } from '@/auth-context'; // Хук контекста авторизации

export default function LoginScreen() {
  const [username, setUsername] = useState(''); // Состояние логина
  const [password, setPassword] = useState(''); // Состояние пароля
  const { login } = useAuth(); // Получаем функцию login из контекста

  // ----- Авторизация через логин и пароль -----
  const handleLogin = () => {
    if (username === 'admin' && password === '1234') {
      login();           // Устанавливаем статус авторизации
      router.replace('/'); // Переходим на главный экран
    } else {
      Alert.alert('Ошибка', 'Неверный логин или пароль'); // Показываем ошибку
    }
  };

  // ----- Авторизация через биометрию -----
  const handleBiometric = async () => {
    const success = await authenticateBiometric();
    if (success) {
      login();            // Успешная биометрия — логиним
      router.replace('/'); // Переход на главный экран
    } else {
      Alert.alert('Ошибка', 'Биометрия не пройдена или недоступна');
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Вход</Text>

      {/* Поля ввода */}
      <TextInput
        placeholder="Логин"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* Кнопка логина */}
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>

      {/* Кнопка биометрии */}
      <TouchableOpacity onPress={handleBiometric} style={styles.button}>
        <Text style={styles.buttonText}>Войти через Face ID / Touch ID</Text>
      </TouchableOpacity>
    </View>
  );
}

// Стили 
const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});