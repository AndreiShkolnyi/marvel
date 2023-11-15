import './charInfo.scss';
import thor from '../../resources/img/thor.jpeg';
import {useState, useEffect} from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);

    const marvelService = new MarvelService();

   useEffect(() => {
    updateChar();
   }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        onCharLoading();

        marvelService
        .getCharacter(charId)
        .then(onCharLoaded)
        .catch(onError)

    }

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }

    const onCharLoading = () => {
        setLoading(true);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

        const skeleton = char || isError || isLoading ? null : <Skeleton/>;
        const errorMessage = isError ? <ErrorMessage/> : null;
        const spinner = isLoading ? <Spinner/> : null;
        const content = !(isLoading || isError || !char) ?  <View char={char}/> : null;

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
    const comicsList = comics.length === 0 ? 'Comics are not available' : comics.map(({name}, i) => {
        if (i >= 10) {
            return;
        }
        return (
            <li key={i} className="char__comics-item">
                {name}
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