import React, { useEffect, useRef, ReactNode } from "react";


// Определение типов Props для компонента Observer
interface Props {
  children: ReactNode; // children - это ReactNode, что позволяет передавать внутрь компонента любые дочерние элементы React
  onContentEndVisible: () => void; // onContentEndVisible - это функция без аргументов, которая не возвращает значение (void)
}

// Встроенный тип IntersectionObserver для определения типа Options
type Options = IntersectionObserver;

// Компонент Observer принимает дочерние элементы и функцию, которая будет вызвана при видимости конца контента
export function Observer({ children, onContentEndVisible }: Props) {
  // Используем useRef для создания ссылки на DOM-элемент, который находится в конце контента
  const endContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Задаем типы для параметров опций IntersectionObserver
    const options: IntersectionObserverInit = {
      rootMargin: "0px", // rootMargin - это строка, определяющая отступы области корневого элемента
      threshold: 1.0, // threshold - это число, представляющее порог для IntersectionObserver
      root: null, // root - это корневой элемент, который используется для определения видимости
    };

    // Создаем экземпляр IntersectionObserver с функцией обратного вызова
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Проверяем, если конец контента видимый
        if (entry.intersectionRatio > 0) {
          onContentEndVisible(); // Вызываем функцию при видимости конца контента
          observer.disconnect(); // Отключаем наблюдение за элементом после обнаружения видимости
        }
      });
    }, options);

    // Если есть ссылка на DOM-элемент, начинаем наблюдение
    if (endContentRef.current) {
      observer.observe(endContentRef.current);
    }

    // Функция очистки: отключаем IntersectionObserver при размонтировании компонента
    return () => {
      observer.disconnect();
    };
  }, [onContentEndVisible]); // Эффект будет запускаться при изменении onContentEndVisible

  return (
    <div>
      {children}
      <div ref={endContentRef} /> {/* Элемент для отслеживания видимости */}
    </div>
  );
}
export {}
