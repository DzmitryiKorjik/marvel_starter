import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AppHeader from "../appHeader/AppHeader";
import Spinner from '../spinner/Spinner';
import Page404 from '../pages/404';  // Импортируем компонент напрямую
import MainPage from '../pages/MainPage';  // Импортируем компонент напрямую
import ComicsPage from '../pages/ComicsPage';  // Импортируем компонент напрямую
import SingleComicLayout from '../pages/singleComicLayout/SingleComicLayout';  // Импортируем компонент напрямую
import SingleCharacterLayout from '../pages/singleCharacterLayout/SingleCharacterLayout';  // Импортируем компонент напрямую
import SinglePage from '../pages/SinglePage';  // Импортируем компонент напрямую

const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <Switch>
                            <Route exact path="/">
                                <MainPage/>
                            </Route>
                            <Route exact path="/comics">
                                <ComicsPage/>
                            </Route>
                            <Route exact path="/comics/:id">
                                <SinglePage Component={SingleComicLayout} dataType='comic'/>
                            </Route>
                            <Route exact path="/characters/:id">
                                <SinglePage Component={SingleCharacterLayout} dataType='character'/>
                            </Route>
                            <Route path="*">
                                <Page404/>
                            </Route>
                        </Switch>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;
