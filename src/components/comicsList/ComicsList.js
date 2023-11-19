import './comicsList.scss';
import { useEffect, useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import { Link } from 'react-router-dom';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [isNewItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [isComicsEnded, setComicsEnded] = useState(false);

    const {isLoading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []); 


    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
        .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;

        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList([...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setOffset((offset) => offset + 8);
        setComicsEnded(ended);
    }


    const renderItems = (arr) => {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li
                 className="comics__item"
                 key={i}>
                <Link to={`/comics/${item.id}`}>
                    <img src={item.thumbnail} alt={item.title} className="comics__item-img" style={imgStyle}/>
                    <div className="comics__item-name">{item.title}</div>
                    <div className="comics__item-price">{item.price}$</div>
                </Link>
            </li>
            )
        });
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

        const items = renderItems(comicsList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = isLoading && !isNewItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
            className="button button__main button__long"
            disabled={isNewItemLoading}
            style={{'display' : isComicsEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;