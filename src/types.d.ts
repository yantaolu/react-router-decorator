import React from 'react';
import { NavigateFunction, RouteObject } from 'react-router-dom';

/**
 * 组件上可设置属性用于开启或关闭 `withPageWrapper` `childrenAsOutlet` 优先级最高
 */
export interface Extra {
  withPageWrapper?: boolean;
  childrenAsOutlet?: boolean;
}

/**
 * 支持的其他的 RouteObject
 */
export type PickRouteObject = Pick<RouteObject, 'loader' | 'action'>;

/**
 * 页面级组件
 */
export type PageComponent = React.ComponentType<any> & Extra;

/**
 * 解析 url search 参数
 */
export type Query = {
  readonly [key in string]: string | number | Array<string | number> | undefined;
};

/**
 * 路由参数
 */
export type Params = {
  readonly [key in string]: string | undefined;
};

/**
 * 注册页面路由时额外的参数
 */
export interface PageDefine {
  title?: string | ((params: Params, query: Query) => string);
  context?: string;
  lazy?: boolean;
}

/**
 * 被默认 PageWrapper 包裹的页面自动解析的参数
 */
export interface WithWrappedProps {
  query: Query;
  params: Params;
  navigate: NavigateFunction;
  path: string;
  children?: React.ReactNode;
}

export interface PageWrapperProps extends PageDefine {
  path: string;
  Component: PageComponent;
  childrenAsOutlet?: boolean;
}

export type PageWrapperType = React.ComponentType<PageWrapperProps>;

export type RouteOption = Omit<PageWrapperProps, 'childrenAsOutlet'> & PickRouteObject;

export type PageOptions = (PageDefine & PickRouteObject) | string;

export interface RenderOptions {
  type?: 'hash' | 'history';
  Wrapper?: React.ComponentType<any>;
  withPageWrapper?: boolean;
  PageWrapper?: PageWrapperType;
  childrenAsOutlet?: boolean;
  debug?: boolean;
}
