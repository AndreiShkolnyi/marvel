import './singleComic.scss';
import xMen from '../../resources/img/x-men.png';
import { useEffect, useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const SingleComic = (props) => {
    const [comics, setComics] = useState(null);

    const {isLoading, error, getComics, clearError} = useMarvelService();

    useEffect(() => {
        updateComics();
       }, [props.comicsId]);

    const updateComics = () => {
        const {comicsId} = props;
        if (!comicsId) {
            return;
        }

        clearError();
        getComics(comicsId)
        .then(onComicsLoaded);

    }

    const onComicsLoaded = (comics) => {
        setComics(comics);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = isLoading ? <Spinner/> : null;
    const content = !(isLoading || error || !comics) ?  <View comics={comics}/> : null;

    return (
        <div className="single-comic">
           {errorMessage}
           {spinner}
           {content}
        </div>
    )
}

const View = ({comics}) => {
    
    const {name, description, thumbnail, price, pageCount} = comics;
    let imgStyle = {'objectFit' : 'cover'};
    if (comics.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'};
    }
    return (
        <>
         <img src={thumbnail} alt={name} className="single-comic__img" style={imgStyle}/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount} pages</p>
                <p className="single-comic__descr">Language: en-us</p>
                <div className="single-comic__price">{price}$</div>
            </div>
            <a href="#" className="single-comic__back">Back to all</a>
        </>
    )
}

export default SingleComic;