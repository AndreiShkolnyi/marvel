import './charInfo.scss';
import {useState, useEffect} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';
import { Link } from 'react-router-dom';

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);

    const {isLoading, error, getCharacter, clearError} = useMarvelService();

   useEffect(() => {
    updateChar();
   }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
        .then(onCharLoaded);

    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

        const skeleton = char || error || isLoading ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = isLoading ? <Spinner/> : null;
        const content = !(isLoading || error || !char) ?  <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {content}
            </div>
        )
    
}

const View = ({char}) => {
    const {name, description, thumbnail, wiki, homepage, comics} = char;
    const emptyStyle = thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : {objectFit: 'cover'};
    const comicsList = comics.length === 0 ? 'Comics are not available' : comics.map(({name,resourceURI}, i) => {
        const comicsId = resourceURI.replace('http://gateway.marvel.com/v1/public/comics/', '');
        if (i >= 10) {
            return;
        }
        return (
            <li key={i} className="char__comics-item">
            <Link to={`/comics/${comicsId}`}>{name}</Link>
            </li>
        )
    })

    return (
        <>
        <div className="char__basics">
                    <img src={thumbnail} alt={name} style={emptyStyle}/>
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
                   {comicsList}
                </ul>
        </>
    )
}

export default CharInfo;