import './charInfo.scss';
import {useState, useEffect} from 'react';
import useMarvelService from '../../services/MarvelService';
import { Link } from 'react-router-dom';
import setContent from '../../utils/setContent';

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);

    const {getCharacter, clearError, process, setProcess} = useMarvelService();

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
        .then(onCharLoaded)
        .then(() => setProcess('confirmed'));

    }

    const onCharLoaded = (char) => {
        setChar(char);
    }


        return (
            <div className="char__info">
               {setContent(process, View , char)}
            </div>
        )
    
}

const View = ({data}) => {
    const {name, description, thumbnail, wiki, homepage, comics} = data;
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