import React from 'react';

import { Layout } from 'antd';

const { Footer } = Layout;

const LayoutFooter = () => {
  return (
    <Footer className="bg-light-gray" style={{ padding: '24px 16px', textAlign: 'right', color: 'darkcyan', background: 'aliceblue' }}>
      © {new Date().getFullYear()}
      {' FTEL DSC'}
    </Footer>
  );
};

export default LayoutFooter;
