import React from 'react';
import { $page } from 'react-router-decorator';

export const About = () => {
  return (
    <h1>
      About <a href='https://www.npmjs.com/package/react-router-decorator'>react-router-decorator</a>
    </h1>
  );
};

$page(About, '/about', { title: '关于' });
