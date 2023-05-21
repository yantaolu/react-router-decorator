import React, { useEffect, useMemo } from 'react';
import { Root, createRoot } from 'react-dom/client';
import {
  // components
  Await,
  BrowserRouter,
  Form,
  HashRouter,
  Link,
  MemoryRouter,
  NavLink,
  Navigate,
  NavigateFunction,
  Outlet,
  RouteObject,
  ScrollRestoration,
  // hooks
  useActionData,
  useAsyncError,
  useAsyncValue,
  useBeforeUnload,
  useFetcher,
  useFetchers,
  useFormAction,
  useHref,
  useInRouterContext,
  useLinkClickHandler,
  useLoaderData,
  useLocation,
  useMatch,
  useMatches,
  useNavigate,
  useNavigation,
  useNavigationType,
  useOutlet,
  useOutletContext,
  useParams,
  useResolvedPath,
  useRevalidator,
  useRouteError,
  useRouteLoaderData,
  useRoutes,
  useSearchParams,
  useSubmit,
} from 'react-router-dom';

import type {
  PageOptions,
  PageWrapper,
  PageWrapperProps,
  ReactComponent,
  RenderOptions,
  RouteOption,
  SearchQuery,
  WithWrappedProps,
} from './types';

/**
 * 记录路由
 */
const _routeMap: Record<string, RouteOption> = {};

/**
 * 地址栏中的 search 转换为 query 对象
 * @param search
 */
const transSearch2Query = (search: string): SearchQuery => {
  return (
    search
      ?.replace(/^\?+/, '')
      .split('&')
      .reduce((prev: Record<string, number | string | Array<string | number>>, current) => {
        try {
          const [key, value] = current.split('=').map(decodeURIComponent);
          // Automatic parsing number
          const val = /^[1-9]\d*$/.test(value) && value <= `${Number.MAX_SAFE_INTEGER}` ? Number(value) : value;
          // Array
          if (key in prev) {
            if (!Array.isArray(prev[key])) {
              prev[key] = [prev[key] as string | number];
            }
            (prev[key] as Array<string | number>).push(val);
          } else {
            prev[key] = val;
          }
        } catch (e) {
          console.error(e);
        }
        return prev;
      }, {}) ?? {}
  );
};

/**
 * 默认页面 Wrapper 附加自动解析 params、query 追加 navigate
 * @param props
 * @constructor
 */
const PageWrapper = (props: PageWrapperProps) => {
  const { Component, title, childrenAsOutlet, context = '', path } = props;
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const query = useMemo(() => transSearch2Query(location.search), [location.search]);

  useEffect(() => {
    const originalTitle = document.title;
    title && (document.title = title);
    return () => {
      document.title = originalTitle;
    };
  }, [title]);

  return (
    <Component path={resolveAbsolutePath(context, path)} params={params} query={query} navigate={navigate}>
      {!!childrenAsOutlet && <Outlet />}
    </Component>
  );
};

/**
 * 路由路径统一转换为绝对路径
 * @param paths
 */
const resolveAbsolutePath = (...paths: string[]) =>
  [
    '/',
    paths
      .filter((path) => Boolean(path?.trim()))
      .map((path) => path.trim())
      .join('/')
      .replace(/\/+$/, ''),
  ]
    .join('/')
    .replace(/\/+/g, '/');

/**
 * 路由路径正则
 */
const routeRegExp = /^(\/?((:?[\w\d_-]+\??)|(\*)))+$/i;

const legalRouteRules = `/
test
/test
/:id
/:id?
/:name/:id
/:name/:id?
/:name?/:id?
/test/*
/:name/*
/:name?/*
/*
*`
  .split('\n')
  .map((str) => str.trim());

// legalRouteRules.map((str) => console[routeRegExp.test(str) ? 'log' : 'error'](str));

/**
 * 类装饰器，用于注册类组件路由
 * @param path 路由路径
 * @param options 附加参数
 */
const page = (path: string | '/' | '*', options?: PageOptions) => {
  const { title, context = '', ...routeObject } = typeof options === 'string' ? { title: options } : options ?? {};

  // 嵌套路由上下文不合法
  if (context.trim() && !context.startsWith('/')) {
    throw new Error('嵌套路由上下文不合法，请使用 "/" 开始的绝对路径，多级嵌套使用完整上下文');
  }

  const absolutePath = resolveAbsolutePath(path);

  if (absolutePath !== '/' && !routeRegExp.test(path)) {
    throw new Error(`路由路径不合法，支持的路由路径如: ${legalRouteRules.map((p) => `"${p}"`)}`);
  }

  return (Component: ReactComponent): void => {
    _routeMap[resolveAbsolutePath(context, path)] = {
      ...routeObject,
      path: absolutePath,
      Component: Component,
      context,
      title,
    };
  };
};

/**
 * 函数注册路由，类组件和函数组件均可使用
 * @param Component
 * @param path
 * @param options
 */
const $page = (Component: ReactComponent, path: string | '/' | '*', options?: PageOptions): void => {
  return page(path, options)(Component);
};

/**
 * 将路由配置转换为目标对象
 * @param config
 * @param options
 */
const transRoute = (
  config: RouteOption,
  options: Pick<RenderOptions, 'PageWrapper' | 'withPageWrapper' | 'childrenAsOutlet'>,
): RouteObject => {
  const { path, Component, title, context, ...routeObject } = config;
  const _withPageWrapper = Component.withPageWrapper ?? options.withPageWrapper;
  const _childrenAsOutlet = Component.childrenAsOutlet ?? options.childrenAsOutlet;
  const _PageWrapper: React.ComponentType<any> = options.PageWrapper ?? PageWrapper;
  return {
    ...routeObject,
    path,
    element: _withPageWrapper ? (
      <_PageWrapper
        context={context}
        path={path}
        Component={Component}
        title={title}
        childrenAsOutlet={_childrenAsOutlet}
      />
    ) : (
      <Component>{_childrenAsOutlet && <Outlet />}</Component>
    ),
  };
};

/**
 * 路由路径排序算法
 * @param a
 * @param b
 */
const routeSorter = (a: string, b: string) => {
  const aArr = a.split('/');
  const bArr = b.split('/');
  const len = Math.max(aArr.length, bArr.length);
  for (let i = 0; i < len; i++) {
    if (aArr[i] && !bArr[i]) return 1;
    if (!aArr[i] && bArr[i]) return -1;
    if (aArr[i] === bArr[i]) {
      continue;
    }
    // *优先级最低
    if (aArr[i] === '*') return 1;
    if (bArr[i] === '*') return -1;
    return aArr[i] > bArr[i] ? 1 : -1;
  }
  return a > b ? 1 : -1;
};

/**
 * useRoutes
 * @param props
 * @constructor
 */
const AppRoutes = (props: Omit<RenderOptions, 'type' | 'Wrapper'>): React.ReactElement | null => {
  const { withPageWrapper = true, PageWrapper, childrenAsOutlet = false, debug = false } = props;
  const _routes = useMemo(() => {
    const _routes: Array<RouteObject> = [];
    const { ['/']: _index, ['/*']: _default, ...pages } = _routeMap;

    const deepContextRoute = (ctx: string, routes: Array<RouteObject>, p?: string): RouteObject | undefined => {
      const len = routes.length;
      let route;
      for (let i = len - 1; i >= 0; i--) {
        const { path, children } = routes[i];
        const absolutePath = resolveAbsolutePath(p ?? '', path as string);
        if (!ctx.startsWith(absolutePath)) {
          continue;
        }
        if (absolutePath === ctx) {
          route = routes[i];
        }
        if (!route && children) {
          route = deepContextRoute(ctx, children, absolutePath);
        }
        if (route) {
          break;
        }
      }
      return route;
    };

    const getContextRoute = (ctx: string): RouteObject | undefined => {
      const _ctx = _routes.find((r) => r.path === ctx);
      if (!_ctx) {
        return deepContextRoute(ctx, _routes);
      }
      return _ctx;
    };

    const transOption = { withPageWrapper, childrenAsOutlet, PageWrapper };

    _index && _routes.push(transRoute(_index, transOption));

    debug && console.log('原始路由路径', Object.keys(_routeMap));

    Object.keys(pages)
      .sort(routeSorter)
      .forEach((p) => {
        const option = pages[p];
        const { path, context, title, Component } = option;
        // 有上下文则是嵌套路由
        if (context) {
          console.log(context, path);
          const parent = getContextRoute(context);
          if (parent && !parent.children) {
            parent.children = [transRoute({ path: path.substring(1), title, Component }, transOption)];
          } else if (parent?.children) {
            parent.children.push(transRoute({ path: path.substring(1), title, Component }, transOption));
          } else {
            console.error('未找到匹配的嵌套上下文');
          }
        } else {
          _routes.push(transRoute(option, transOption));
        }
      });

    _default && _routes.push(transRoute({ ..._default, path: '*' }, transOption));

    if (debug) {
      console.warn('[SpaRouter Debug]: 路由配置如下\n');
      console.log(_routes);
    }
    return _routes;
  }, [Object.keys(_routeMap).join(';')]);

  return useRoutes(_routes);
};

/**
 * Router with Routes
 * @param props
 * @constructor
 */
const AppRouter = (props: RenderOptions) => {
  const { type, Wrapper = React.Fragment, ...others } = props;
  const Router = type === 'history' ? BrowserRouter : HashRouter;
  return (
    <Wrapper>
      <Router>
        <AppRoutes {...others} />
      </Router>
    </Wrapper>
  );
};

/**
 * 获取所有的路由绝对路径及相关配置
 */
const getRouteConfig = (): Record<string, RouteOption> =>
  Object.keys(_routeMap).reduce((prev, current) => {
    prev[current] = { ..._routeMap[current] };
    return prev;
  }, {} as Record<string, RouteOption>);

let _root: Root;
/**
 * ReactDOM.render
 * @param element
 * @param options
 */
const renderApp = (element: HTMLElement, options?: RenderOptions) => {
  const root = _root ?? createRoot(element);
  !_root && (_root = root);
  root.render(<AppRouter {...options} />);
};

export {
  Await,
  Form,
  Link,
  MemoryRouter,
  NavLink,
  Navigate,
  Outlet,
  ScrollRestoration,
  // hooks
  useActionData,
  useAsyncError,
  useAsyncValue,
  useBeforeUnload,
  useFetcher,
  useFetchers,
  useFormAction,
  useHref,
  useInRouterContext,
  useLinkClickHandler,
  useLoaderData,
  useLocation,
  useMatch,
  useMatches,
  useNavigate,
  useNavigation,
  useNavigationType,
  useOutlet,
  useOutletContext,
  useParams,
  useResolvedPath,
  useRevalidator,
  useRouteError,
  useRouteLoaderData,
  useRoutes,
  useSearchParams,
  useSubmit,
  // self
  $page,
  AppRouter,
  AppRoutes,
  getRouteConfig,
  PageWrapper,
  page,
  renderApp,
  routeSorter,
  transSearch2Query,
};
export type { NavigateFunction, PageWrapperProps, WithWrappedProps };
