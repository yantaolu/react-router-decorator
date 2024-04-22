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
export type PickRouteObject = Omit<RouteObject, 'Component' | 'path' | 'children'>;

/**
 * 页面级组件
 */
export type PageComponent = React.ComponentType<any> & Extra;

/**
 * 解析 url search 参数
 */
export type Query = {
  readonly [key: string]: undefined | string | string[] | Query | Query[];
};

/**
 * 路由参数
 */
export type Params = {
  readonly [key: string]: string | undefined;
};

/**
 * 注册页面路由时额外的参数
 */
export interface PageDefine {
  title?: string | ((params: Params, query: Query) => string);
  context?: string;
  lazy?: boolean;
  mpa?: string;
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
  /**
   * 路由类型
   */
  type?: 'hash' | 'history';
  /**
   * App Wrapper
   */
  Wrapper?: React.ComponentType<any>;
  /**
   * 使用默认 Page Wrapper
   */
  withPageWrapper?: boolean;
  /**
   * 自定义 Page Wrapper
   */
  PageWrapper?: PageWrapperType;
  /**
   * 使用 children 代替 Outlet
   */
  childrenAsOutlet?: boolean;
  /**
   * 开启调试模式，控制台输出路由信息
   */
  debug?: boolean;
  /**
   * 开启路由辅助工具
   */
  helper?: boolean;
}
