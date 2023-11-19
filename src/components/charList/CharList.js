import {useState, useEffect, useRef, useMemo} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import useMarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';


const setContent = (process, Component, isNewItemLoading) => {

    switch (process) {
        case 'waiting' : 
            return <Spinner/>;
        case 'loading' : 
            return isNewItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed' : 
            return <Component/>;
        case 'error' : 
            return <ErrorMessage/>;
        default :
            throw new Error('Unexpected pocess state');
    }
}

const CharList = (props) => {
    const [isNewItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [isCharEnded, setCharEnded] = useState(false);
    const [charList, setCharList] = useState([]);
    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []); 

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
        .then(onCharListLoaded)
        .then(() => setProcess('confirmed'));
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList([...charList, ...newCharList]);
        setNewItemLoading(false);
        setOffset((offset) => offset + 9);
        setCharEnded(ended);
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
               <CSSTransition
               key={item.id}
               timeout={300}
               classNames='char__item'
               >
                 <li 
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    ref={(el) => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
               </CSSTransition>
            )
        });
        return (
                <ul className="char__grid">
                    <TransitionGroup component={null}>
                        {items}
                    </TransitionGroup>
                </ul>
        )
    }

    const elements = useMemo(() => setContent(process, () => renderItems(charList), isNewItemLoading), [process]);

    return (
        <div className="char__list">
            {elements}
            <button 
            className="button button__main button__long"
            disabled={isNewItemLoading}
            style={{'display' : isCharEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>      
    )    
    
}

export default CharList;