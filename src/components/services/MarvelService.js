class MarvelService {
    // Базовый URL для запросов к API Marvel
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    // API ключ для аутентификации
    _apiKey = 'apikey=fbf420198ffdacad302959fd720a5d26';
    _baseOffset = 210;

    // Метод для выполнения HTTP-запросов к серверу
    getResource = async (url) => {
        // Отправка запроса и получение ответа
        let res = await fetch(url);

        // Проверка успешности ответа
        if (!res.ok) {
            // В случае неудачного ответа, выбрасывается исключение с сообщением об ошибке
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        // Преобразование ответа в JSON формат и его возврат
        return await res.json();
    }

    // Метод для получения информации о всех персонажах
    getAllCharacters = async (offset = this._baseOffset) => {
        // Формирование URL запроса для получения списка персонажей
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        // Преобразование данных о персонажах и возврат результата
        return res.data.results.map(this._transformCharacter);
    }

    // Метод для получения информации о персонаже по его идентификатору
    getCharacter = async (id) => {
        // Формирование URL запроса для получения информации о конкретном персонаже
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        // Преобразование данных о персонаже и возврат результата
        return this._transformCharacter(res.data.results[0]);
    }

    // Преобразование данных о персонаже
    _transformCharacter = (char) => {
        return {
            id: char.id,
            // Имя персонажа
            name: char.name,
            // Описание персонажа (обрезанное до 210 символов)
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            // URL изображения персонажа
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            // Домашняя страница персонажа
            homepage: char.urls[0].url,
            // Ссылка на Wiki персонажа
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService; // Экспорт класса MarvelService
