import React from 'react';
import './pages/about';
import './pages/user';
import './pages/info';
import { renderApp } from 'react-router-decorator';


renderApp(document.getElementById('app') as HTMLElement, { type: 'history', withPageWrapper: false });