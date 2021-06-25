import React from 'react';
import {
  ApiOutlined,
  CodeOutlined,
  ControlOutlined,
  DashboardOutlined,
  HeartOutlined,
  MonitorOutlined,
  RobotOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  DatabaseOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

export const menuItems = [
  {
    key: 0,
    title: 'Trang chủ',
    icon: <DashboardOutlined />,
    url: '/',
  },
  {
    key: 1,
    title: 'Admin',
    icon: <RobotOutlined />,
    isAuthenticated: true,
    isAdmin: true,
    child: [
      {
        key: 101,
        title: 'User management',
        icon: <TeamOutlined />,
        url: '/admin/user-management',
      },
      {
        key: 102,
        title: 'Metrics',
        icon: <MonitorOutlined />,
        url: '/admin/metrics',
      },
      {
        key: 103,
        title: 'Health management',
        icon: <HeartOutlined />,
        url: '/admin/health',
      },
      {
        key: 104,
        title: 'Configuration',
        icon: <ControlOutlined />,
        url: '/admin/configuration',
      },
      {
        key: 105,
        title: 'Logs',
        icon: <CodeOutlined />,
        url: '/admin/logs',
      },
      {
        key: 106,
        title: 'API',
        icon: <ApiOutlined />,
        url: '/admin/docs',
      },
    ],
  },
  {
    key: 2,
    title: 'Quản lý khách hàng',
    icon: <TeamOutlined />,
    url: '/users',
  },
];
