import * as LocalAuthentication from 'expo-local-authentication';

/**
 * Проверка возможности и запуск биометрической аутентификации
 * @returns true, если успешна, false если отказ или ошибка
 */
export async function authenticateBiometric(): Promise<boolean> {
  try {
    // ----- Проверяем наличие биометрического сенсора -----
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false; // Нет сенсора — не можем использовать

    // ----- Проверяем, настроена ли биометрия пользователем -----
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return false; // Биометрия не настроена — отклоняем

    // ----- Запуск аутентификации -----
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Авторизация',       // Сообщение для пользователя
      fallbackLabel: 'Использовать пароль', // Кнопка fallback
      disableDeviceFallback: false,       // Разрешаем fallback на пароль
    });

    return result.success; // Возвращаем true/false в зависимости от результата
  } catch (e) {
    console.warn('Biometric auth error:', e); // Логируем ошибку
    return false;
  }
}
