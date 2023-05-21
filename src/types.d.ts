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

type RouteOption = {
  path: string;
  Component: ReactComponent;
  title?: string;
  context?: string;
} & PickRouteObject;

type PageOptions =
  | ({
      title?: string;
      context?: string;
    } & PickRouteObject)
  | string;

type SearchQuery = Record<string, string | number | Array<string | number>>;

interface WithWrappedProps {
  query: SearchQuery;
  params: Record<string, string>;
  navigate: NavigateFunction;
  children?: React.ReactNode;
}

interface PageWrapperProps {
  path: string;
  Component: ReactComponent;
  title?: string;
  context?: string;
  childrenAsOutlet?: boolean;
}

type PageWrapper = React.ComponentType<PageWrapperProps>;

interface RenderOptions {
  type?: 'hash' | 'history';
  Wrapper?: ReactComponent;
  withPageWrapper?: boolean;
  PageWrapper?: PageWrapper;
  childrenAsOutlet?: boolean;
  debug?: boolean;
}

export type {
  PageWrapper,
  PageWrapperProps,
  PageOptions,
  ReactComponent,
  RenderOptions,
  RouteOption,
  SearchQuery,
  WithWrappedProps,
};
