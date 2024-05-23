import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

const CharInfo = ({ charId }) => {
    // Состояния компонента
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // Создание экземпляра MarvelService
    const marvelService = useRef(new MarvelService());

    // Вызываем updateChar при монтировании компонента и при изменении charId
    useEffect(() => {
        updateChar();
    }, [charId]);

    // Обновление информации о персонаже
    const updateChar = () => {
        if (!charId) {
            return;
        }

        // Устанавливаем состояние загрузки
        onCharLoading();

        // Получаем информацию о персонаже из сервиса Marvel
        marvelService.current
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError);
    }

    // Обработка успешной загрузки информации о персонаже
    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }

    // Установка состояния загрузки
    const onCharLoading = () => {
        setLoading(true);
    }

    // Обработка ошибки загрузки информации о персонаже
    const onError = () => {
        setLoading(false);
        setError(true);
    }

    // Переменные для управления отображением контента
    const skeleton = char || loading || error ? null : <Skeleton />;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    );
}

// Компонент для отображения информации о персонаже
const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;

    // Установка стиля изображения
    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'contain' };
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {
                    comics.map((item, i) => {
                        if (i > 9) return null;
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        );
                    })
                }
            </ul>
        </>
    );
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;
