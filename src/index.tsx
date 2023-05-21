import React, { ComponentClass, FC, Fragment, ReactElement, ReactNode, useEffect, useMemo } from 'react';
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

export type { NavigateFunction };
export {
  // components
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
};

interface Extra {
  withPageWrapper?: boolean;
  childrenAsOutlet?: boolean;
}

type ReactComponent = (ComponentClass<any, any> | FC<any>) & Extra;

type RouteOption = {
  path: string;
  Component: ReactComponent;
  title?: string;
  context?: string;
};

const _routeMap: Record<string, RouteOption> = {};

type PageOptions =
  | {
      title?: string;
      context?: string;
    }
  | string;

const transSearch2Query = (search: string): Record<string, string | number> => {
  return (
    search
      ?.replace(/^\?+/, '')
      .split('&')
      .reduce((prev: Record<string, number | string>, current) => {
        try {
          const [key, value] = current.split('=').map(decodeURIComponent);
          prev[key] = /^[1-9]\d*$/.test(value) && value <= `${Number.MAX_SAFE_INTEGER}` ? Number(value) : value;
        } catch (e) {
          console.error(e);
        }
        return prev;
      }, {}) ?? {}
  );
};

export interface PageWrapperProps {
  query: Record<string, string | number>;
  params: Record<string, string>;
  navigate: NavigateFunction;
  children?: ReactNode;
}

const PageWrapper = (props: {
  path: string;
  Component: ReactComponent;
  title?: string;
  context?: string;
  childrenAsOutlet?: boolean;
}) => {
  const { Component, path, title, childrenAsOutlet } = props;
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const query = useMemo(() => transSearch2Query(location.search), [location]);

  useEffect(() => {
    if (title) {
      const originalTitle = document.title;
      document.title = title;
      return () => {
        document.title = originalTitle;
      };
    }
    return () => undefined;
  }, []);

  return (
    <Component
      {...{
        query,
        params,
        navigate,
        path,
      }}
    >
      {!!childrenAsOutlet && <Outlet />}
    </Component>
  );
};

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

export const page = (path: string | '/' | '*', options?: PageOptions) => {
  const { title, context = '' } = typeof options === 'string' ? { title: options } : options ?? {};

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
      path: absolutePath,
      Component: Component,
      context,
      title,
    };
  };
};

export const $page = (Component: ReactComponent, path: string | '/' | '*', options?: PageOptions) => {
  return page(path, options)(Component);
};

export interface CustomPageWrapperProps {
  path: string;
  Component: ReactComponent;
  title?: string;
  [p: string]: any;
}

type CustomPageWrapper = FC<CustomPageWrapperProps> | ComponentClass<CustomPageWrapperProps, any>;

const transRoute = (
  config: RouteOption,
  options: { withPageWrapper: boolean; childrenAsOutlet: boolean; CustomPageWrapper?: CustomPageWrapper },
) => {
  const { path, Component, title } = config;
  const _withPageWrapper = Component.withPageWrapper ?? options.withPageWrapper;
  const _childrenAsOutlet = Component.childrenAsOutlet ?? options.childrenAsOutlet;
  const _PageWrapper: any = options.CustomPageWrapper ?? PageWrapper;
  return {
    path,
    element: _withPageWrapper ? (
      <_PageWrapper path={path} Component={Component} title={title} childrenAsOutlet={_childrenAsOutlet} />
    ) : (
      <Component>{_childrenAsOutlet && <Outlet />}</Component>
    ),
  };
};

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

export const AppRoutes = ({
  withPageWrapper = true,
  CustomPageWrapper,
  childrenAsOutlet = false,
  debug,
}: {
  withPageWrapper?: boolean;
  CustomPageWrapper?: CustomPageWrapper;
  childrenAsOutlet?: boolean;
  debug?: boolean;
}): ReactElement | null => {
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

    const transOption = { withPageWrapper, childrenAsOutlet, CustomPageWrapper };

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
 * 获取所有的路由绝对路径及相关配置
 */
export const getRouteConfig = (): Record<string, RouteOption> =>
  Object.keys(_routeMap)
    .sort(routeSorter)
    .reduce((prev, current) => {
      prev[current] = _routeMap[current];
      return prev;
    }, {} as Record<string, RouteOption>);

interface RenderOptions {
  type?: 'hash' | 'history';
  Wrapper?: ReactComponent;
  withPageWrapper?: boolean;
  CustomPageWrapper?: CustomPageWrapper;
  childrenAsOutlet?: boolean;
  debug?: boolean;
}

export const AppRouter = (props: RenderOptions) => {
  const { type, Wrapper = Fragment, ...others } = props;
  const Router = type === 'history' ? BrowserRouter : HashRouter;
  return (
    <Wrapper>
      <Router>
        <AppRoutes {...others} />
      </Router>
    </Wrapper>
  );
};

let _root: Root;
export const renderApp = (element: HTMLElement, options?: RenderOptions) => {
  const root = _root ?? createRoot(element);
  !_root && (_root = root);
  root.render(<AppRouter {...options} />);
};
