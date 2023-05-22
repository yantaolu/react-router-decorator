import React from 'react';
import { NavigateFunction, RouteObject } from 'react-router-dom';

/**
 * 组件上可设置属性用于开启或关闭 `withPageWrapper` `childrenAsOutlet` 优先级最高
 */
interface Extra {
  withPageWrapper?: boolean;
  childrenAsOutlet?: boolean;
}

type ReactComponent = React.ComponentType<any> & Extra;

type PickRouteObject = Pick<RouteObject, 'loader' | 'action'>;

type SearchQuery = Record<string, string | number | Array<string | number> | undefined>;

interface WithWrappedProps {
  query: SearchQuery;
  params: Record<string, string>;
  navigate: NavigateFunction;
  path: string;
  children?: React.ReactNode;
}

interface PageWrapperProps {
  path: string;
  Component: ReactComponent;
  title?: string | ((params: Record<string, string | undefined>, query: SearchQuery) => string);
  context?: string;
  childrenAsOutlet?: boolean;
  lazy?: boolean;
}

type PageWrapperType = React.ComponentType<PageWrapperProps>;

type RouteOption = {
  path: string;
  Component: ReactComponent;
  title?: PageWrapperProps['title'];
  context?: string;
  lazy?: boolean;
} & PickRouteObject;

type PageOptions = Omit<RouteOption, 'path' | 'Component'> | string;

interface RenderOptions {
  type?: 'hash' | 'history';
  Wrapper?: ReactComponent;
  withPageWrapper?: boolean;
  PageWrapper?: PageWrapperType;
  childrenAsOutlet?: boolean;
  debug?: boolean;
}

export type {
  PageOptions,
  PageWrapperProps,
  PageWrapperType,
  ReactComponent,
  RenderOptions,
  RouteOption,
  SearchQuery,
  WithWrappedProps,
};
