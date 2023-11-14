import './charInfo.scss';
import thor from '../../resources/img/thor.jpeg';
import React from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';

class CharInfo extends React.Component {
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }

        this.onCharLoading();

        this.marvelService
        .getCharacter(this.props.charId)
        .then(this.onCharLoaded)
        .catch(this.onError)

    }

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    render() {
        const {char,loading, error} = this.state;

        const skeleton = char || error || loading ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ?  <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {content}
            </div>
        )
    }
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