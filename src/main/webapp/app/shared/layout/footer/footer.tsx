import React from 'react';

import {Layout} from "antd";

const { Footer } = Layout;

const LayoutFooter = () => {
  return (
    <Footer style={{ textAlign: 'left', marginTop: -24, color: "gray" }}>
      © {new Date().getFullYear()}{" FTEL DSC"}
    </Footer>
  );
};

export default LayoutFooter;
