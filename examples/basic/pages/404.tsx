import React from 'react';
import { $page } from 'react-router-decorator';

const _404 = () => {
  return <div>404</div>;
};

$page(_404, '*', { context: '/', title: '404' });
