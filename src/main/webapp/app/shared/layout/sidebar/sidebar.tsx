import './sidebar.scss';

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import { Brand } from 'app/shared/layout/sidebar/sidebar-components';
import { menuItems } from './sidebar-item';

export interface ISidebarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
}

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

const Sidebar = (props: ISidebarProps) => {
  const { isAuthenticated, isAdmin, isInProduction, isOpenAPIEnabled } = props;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const path = useLocation().pathname;

  const findMenuItem = arr => {
    if (path.length === 0 || path === '/') return { key: 0 };
    if (!Array.isArray(arr)) return arr;
    return (
      Array.isArray(arr) &&
      arr.find((item, i) => {
        if (item.child != null) return findMenuItem(item.child);
        else if (item.url === path) return item.key;
      })
    );
  };

  let defaultOpenItem = findMenuItem(menuItems);
  defaultOpenItem = defaultOpenItem == null ? { key: -1 } : defaultOpenItem;

  let defaultActiveItem = findMenuItem(defaultOpenItem.child);
  defaultActiveItem = defaultActiveItem == null ? { key: -1 } : defaultActiveItem;

  const defaultOpen = defaultOpenItem.key.toString();
  const defaultActive = defaultActiveItem.key.toString();

  const [activeKey, setActiveKey] = useState(defaultActive);
  const [openKey, setOpenKey] = useState(defaultOpen);
  const menuClickHandle = item => {
    setActiveKey(item.key.toString());
  };

  const _menuProcess = nodes => {
    return (
      Array.isArray(nodes) &&
      nodes.map((item, i) => {
        if ((item.isAuthenticated && !isAuthenticated) || (item.isAdmin && !isAdmin) || (item.url === '/admin/docs' && !isOpenAPIEnabled))
          return;

        const menu = _menuProcess(item.child);

        if (menu.length > 0) {
          return (
            <SubMenu key={item.key.toString()} icon={item.icon} title={item.title} style={{ fontSize: '12px', fontWeight: 'bold' }}>
              {menu}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item icon={item.icon} key={item.key.toString()}>
              <Link to={item.url} style={{ textDecoration: 'none', fontSize: '12px' }}>
                {item.title}
              </Link>
            </Menu.Item>
          );
        }
      })
    );
  };
  const menu = _menuProcess(menuItems);

  return (
    <Sider className={'text-center'} trigger={null} collapsible collapsed={!sidebarOpen}>
      <Brand expanded={sidebarOpen} />
      <Menu theme="dark" mode="inline" selectedKeys={[activeKey]} defaultOpenKeys={[openKey]} onClick={menuClickHandle}>
        {menu}
      </Menu>
      <div className="sider-trigger">
        {sidebarOpen ? (
          <MenuFoldOutlined className="trigger" onClick={toggleSidebar} />
        ) : (
          <MenuUnfoldOutlined className="trigger" onClick={toggleSidebar} />
        )}
      </div>
    </Sider>
  );
};

export default Sidebar;
