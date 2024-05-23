import React, { useState, useEffect, useRef, useCallback } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../services/MarvelService';
import './charList.scss';

const CharList = (props) => {
    // Состояния компонента
    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    // Ссылка на массив элементов списка для управления фокусом
    const charRefs = useRef([]);

    // Создание экземпляра MarvelService
    const marvelService = useRef(new MarvelService());

    // Аналог componentDidMount - вызов функции при монтировании компонента
    useEffect(() => {
        onRequest(offset);
    }, []);

    // Функция запроса данных
    const onRequest = (offset) => {
        // Установка состояния загрузки новых элементов
        onCharListLoading();
        // Получение списка персонажей из MarvelService
        marvelService.current.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError);
    }

    // Установка состояния при загрузке нового списка персонажей
    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    // Обработка успешного ответа с новыми персонажами
    const onCharListLoaded = (newCharList) => {
        // Проверка, достигнут ли конец списка персонажей
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        // Обновление состояния
        setCharList(charList => [...charList, ...newCharList]);
        setLoading(false);
        setNewItemLoading(false);
        setOffset(offset + 9);
        setCharEnded(ended);
    }

    // Обработка ошибки
    const onError = () => {
        setError(true);
        setLoading(false);
    }
// Обработчик событий нажатия клавиш
const onKeyPress = useCallback((event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
        // Предотвращаем стандартное поведение страницы при нажатии клавиш Enter или пробел
        event.preventDefault();
        // Выбираем элемент при нажатии клавиш Enter или пробел
        props.onCharSelected(charList[index].id);
    } else if (event.key === 'ArrowUp' && index > 0) {
        // Перемещение фокуса на предыдущий элемент при нажатии стрелки вверх
        charRefs.current[index - 1].focus();
    } else if (event.key === 'ArrowDown' && index < charRefs.current.length - 1) {
        // Перемещение фокуса на следующий элемент при нажатии стрелки вниз
        charRefs.current[index + 1].focus();
    }
}, [charList, props]);

    // Функция для отображения списка персонажей
    const renderItems = (arr) => {
        const items = arr.map((item, index) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                <li
                    className="char__item"
                    key={item.id}
                    ref={el => charRefs.current[index] = el} // Сохранение ссылки на элемент
                    tabIndex={0} // Установка возможности получения фокуса
                    onClick={() => props.onCharSelected(item.id)}
                    onKeyPress={(event) => onKeyPress(event, index)}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        }); 
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    // Переменные для управления отображением контента
    const items = renderItems(charList);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': charEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;
