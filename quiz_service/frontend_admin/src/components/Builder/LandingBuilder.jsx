import { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsBlocksBasic from 'grapesjs-blocks-basic';

export default function LandingBuilder({ quiz, setQuiz }) {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorInstance.current) return;

    editorInstance.current = grapesjs.init({
      container: editorRef.current,
      fromElement: true,
      height: '600px',
      width: 'auto',
      storageManager: false,
      plugins: [gjsBlocksBasic],
      pluginsOpts: {
        gjsBlocksBasic: {
          category: 'Блоки',
          blocks: ['text', 'link', 'image', 'video', 'column1', 'column2', 'column3']
        }
      },
      i18n: {
        locale: 'ru',
        messages: {
          ru: {
            styleManager: {
              empty: 'Выберите элемент для изменения стиля',
              sectors: {
                dimension: 'Размеры',
                typography: 'Текст',
                decorations: 'Оформление'
              },
              properties: {
                width: 'Ширина',
                height: 'Высота',
                padding: 'Внутренние отступы',
                margin: 'Внешние отступы',
                'font-size': 'Размер шрифта',
                'font-weight': 'Жирность',
                color: 'Цвет текста',
                'text-align': 'Выравнивание',
                'background-color': 'Цвет фона',
                'border-radius': 'Скругление углов'
              }
            },
            traitManager: {
              empty: 'Выберите элемент для настройки',
              traits: {
                id: 'ID (важно: start-quiz-btn)',
                title: 'Подсказка',
                href: 'Ссылка',
                target: 'Открывать в',
                src: 'Источник'
              }
            },
            assetManager: {
              addButton: 'Добавить изображение',
              modalTitle: 'Галерея',
              uploadTitle: 'Перетащите файлы сюда или кликните'
            }
          }
        }
      },
      styleManager: {
        clearProperties: true,
        sectors: [
          {
            name: 'Размеры',
            open: true,
            buildProps: ['width', 'height', 'padding', 'margin']
          },
          {
            name: 'Текст',
            open: true,
            buildProps: ['font-size', 'font-weight', 'color', 'text-align']
          },
          {
            name: 'Оформление',
            open: true,
            buildProps: ['background-color', 'border-radius']
          }
        ]
      }
    });

    const editor = editorInstance.current;

    if (quiz.settings?.landingData?.components) {
      editor.setComponents(JSON.parse(quiz.settings.landingData.components));
      editor.setStyle(JSON.parse(quiz.settings.landingData.styles));
    } else {
      editor.setComponents(`
        <div style="padding: 50px; text-align: center; background-color: #f4f6f8; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <h1 style="font-family: sans-serif; color: #333; margin-bottom: 20px;">${quiz.name}</h1>
          <p style="font-family: sans-serif; color: #666; margin-bottom: 40px; font-size: 18px;">Пройдите опрос и получите результат</p>
          <button id="start-quiz-btn" style="padding: 15px 40px; background-color: #009ef7; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 18px; font-weight: bold;">Начать</button>
        </div>
      `);
    }

    editor.on('update', () => {
      const components = JSON.stringify(editor.getComponents());
      const styles = JSON.stringify(editor.getStyle());
      const html = editor.getHtml();
      const css = editor.getCss();

      setQuiz(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          landingData: { components, styles, html, css }
        }
      }));
    });

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [quiz.name]);

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div ref={editorRef}></div>
      <div style={{ padding: '15px', background: '#fff3cd', color: '#856404', fontSize: '14px', borderTop: '1px solid #ddd' }}>
        <strong>Системное требование:</strong> Кнопка запуска квиза должна иметь ID <code>start-quiz-btn</code> (настраивается в свойствах элемента - значок шестеренки). Без этого триггер открытия вопросов не сработает.
      </div>
    </div>
  );
}