import React, { ComponentClass, FC, useEffect } from 'react';
import { renderApp, useParams } from 'react-router-decorator';
import './pages/about';
import './pages/home';
import './pages/info';
import './pages/user';

const CustomPageWrapper = (props: { path: string; Component: ComponentClass<any> | FC<any>; title?: string }) => {
  const { Component, title } = props;

  // 自动修改 document.title 内置默认 PageWrapper 已实现该功能
  useEffect(() => {
    const originalTitle = document.title;

    title && (document.title = title);

    return () => {
      document.title = originalTitle;
    };
  }, []);

  const params = useParams();

  return (
    <div>
      <Component params={params} />
    </div>
  );
};

renderApp(document.getElementById('app') as HTMLElement, { type: 'history', withPageWrapper: true, CustomPageWrapper });
