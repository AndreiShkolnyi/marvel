import { useState } from 'react';
import {Helmet} from 'react-helmet';

import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import RandomChar from "../randomChar/RandomChar";
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import decoration from '../../resources/img/vision.png';
import CharSearchForm from '../charSearchPanel/CharSearchForm';

const MainPage = () => {

    const [selectedChar, setSelectedChar] = useState(null);

   const onCharSelected = (id) => {
        setSelectedChar(id);
    }
    
    return (
        <>
        <Helmet>
            <meta
                name="description"
                content="Marvel information portal"
            />
            <title>Marvel information portal</title>
        </Helmet>
         <ErrorBoundary>
              <RandomChar/>               
         </ErrorBoundary>
        <div className="char__content">
            <ErrorBoundary>
            <CharList onCharSelected={onCharSelected}/>    
            </ErrorBoundary>
            <div>
            <ErrorBoundary>
            <CharInfo charId={selectedChar}/>
            </ErrorBoundary>
            <CharSearchForm/>
            </div>
        </div>
        <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;