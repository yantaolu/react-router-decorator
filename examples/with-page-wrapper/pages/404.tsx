import React from 'react';
import { $page, useNavigate } from 'react-router-decorator';

export const _404Page = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>当前页面不存在</div>
      <div onClick={() => navigate('/')}>返回首页</div>
    </>
  );
};

_404Page.withPageWrapper = false;

$page(_404Page, '*', { title: '你迷路了' });
