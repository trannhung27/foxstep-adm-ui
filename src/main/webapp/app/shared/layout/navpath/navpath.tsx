import React from 'react'
import {Link, useLocation} from 'react-router-dom';

import {Breadcrumb} from 'antd';

const NavPath = (props) => {

  function Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const currentPath = useLocation().pathname;

  let pathSplit;
  (currentPath === "/") ? pathSplit = ["Dashboard"]
    : pathSplit = currentPath.split('/').filter(e => e !== "")

  const breads = pathSplit.map((item, i) => {
    item = item.replace("-", " ");
    return (
      <Breadcrumb.Item key={item}>
          {Capitalize(item)}
      </Breadcrumb.Item>
    )
  })

  return (
    <Breadcrumb style={{margin: '24px 0px 0px 16px'}}>
      {breads}
    </Breadcrumb>
  );
}

export default NavPath
