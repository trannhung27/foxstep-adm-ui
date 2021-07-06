import React from 'react';

import { Layout } from 'antd';

const { Footer } = Layout;

const LayoutFooter = () => {
  return (
    <Footer style={{ textAlign: 'left' }} className="bg-light-gray">
      © {new Date().getFullYear()}
      {' FTEL DSC'}
    </Footer>
  );
};

export default LayoutFooter;
