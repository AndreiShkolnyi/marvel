import {useState, useEffect, useRef} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {

    const [isError, setError] = useState(false);
    const [isNewItemLoading, setNewItemLoading] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [offset, setOffset] = useState(210);
    const [isCharEnded, setCharEnded] = useState(false);
    const [charList, setCharList] = useState([]);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, []);

    const onRequest = (offset) => {
        onNewCharListLoading();
        marvelService
        .getAllCharacters(offset)
        .then(onCharListLoaded)
        .catch(onError)
    }

    const onNewCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length <= 8) {
            ended = true;
        }
        setCharList((charList) => [...charList, ...newCharList]);
        setLoading(false);
        setNewItemLoading(false);
        setOffset((offset) => offset + 9);
        setCharEnded(isCharEnded => ended);
    }

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const renderItems = (arr) => {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    ref={(el) => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    >
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
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

        const items = renderItems(charList);
        const errorMessage = isError ? <ErrorMessage/> : null;
        const spinner = isLoading ? <Spinner/> : null;
        const content = !(isLoading || isError) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                className="button button__main button__long"
                disabled={isNewItemLoading}
                style={{'display' : isCharEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    
}

export default CharList;