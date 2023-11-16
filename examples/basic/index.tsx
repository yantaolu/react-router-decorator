import React from 'react';
import { $page, DevRouterHelper, Outlet, WithWrappedProps, renderApp } from 'react-router-decorator';
import './pages/404';
import './pages/about';
import './pages/home';
import './pages/info';
import './pages/user';

const App = (props: WithWrappedProps) => {
  return (
    <>
      <DevRouterHelper />
      <div>主路由</div>
      <Outlet />
      {props.children}
    </>
  );
};

$page(App, '/');

renderApp(document.getElementById('app') as HTMLElement, { type: 'hash', withPageWrapper: false, debug: true });
