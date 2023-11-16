import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import PropTypes from 'prop-types';

import decoration from '../../resources/img/vision.png';
import React, { useState } from 'react';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import ComicsList from '../comicsList/ComicsList';
import AppBanner from '../appBanner/AppBanner';
import SingleComic from '../singleComic/SingleComic';

const App = () => {

    const [selectedChar, setSelectedChar] = useState(null);

   const onCharSelected = (id) => {
        setSelectedChar(id);
    }

        return (
            <div className="app">
                <AppHeader/>
                <main>
                {/* <AppBanner/> */}
                    <RandomChar/>
                    <div className="char__content">
                        <CharList onCharSelected={onCharSelected}/>
                        <ErrorBoundary>
                        <CharInfo charId={selectedChar}/>
                        </ErrorBoundary>
                    </div>
                    {/* <ComicsList/> */}
                    {/* <SingleComic comicsId={108450}/> */}
                    <img className="bg-decoration" src={decoration} alt="vision"/>
                </main>
            </div>
        )
    
}

App.propTypes = {
    onCharSelected: PropTypes.func
}

export default App;