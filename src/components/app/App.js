import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AppHeader from '../appHeader/AppHeader';
import Spinner from '../spinner/Spinner';
import Page404 from '../pages/404';
import MainPage from '../pages/MainPage';
import ComicsPage from '../pages/ComicsPage';
import SingleComicLayout from '../pages/singleComicLayout/SingleComicLayout';
import SingleCharacterLayout from '../pages/singleCharacterLayout/SingleCharacterLayout';
import SinglePage from '../pages/SinglePage';

const App = () => {
    return (
        <Router>
            <div className='app'>
                <AppHeader />
                <main>
                    <Suspense fallback={<Spinner />}>
                        <Routes>
                            <Route path='/' element={<MainPage />} />
                            <Route path='/comics' element={<ComicsPage />} />
                            <Route
                                path='/comics/:id'
                                element={
                                    <SinglePage
                                        Component={SingleComicLayout}
                                        dataType='comic'
                                    />
                                }
                            />
                            <Route
                                path='/characters/:id'
                                element={
                                    <SinglePage
                                        Component={SingleCharacterLayout}
                                        dataType='character'
                                    />
                                }
                            />
                            <Route path='*' element={<Page404 />} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    );
};

export default App;
