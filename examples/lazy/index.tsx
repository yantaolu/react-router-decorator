import { lazy } from 'react';
import { $page, renderApp } from 'react-router-decorator';
import './pages/404';
import './pages/home';

const User = lazy(() => import('./pages/user'));
const Info = lazy(() => import('./pages/info'));
const About = lazy(() => import('./pages/about'));

$page(User, '/user', { lazy: true });
$page(Info, '/info/:id', { title: (params) => `用户详情-${params.id ?? ''}`, context: '/user', lazy: true });
$page(About, '/about', { title: '关于', lazy: true });

renderApp(document.getElementById('app') as HTMLElement, { type: 'hash', withPageWrapper: true });
