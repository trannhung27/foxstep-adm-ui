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
    title: 'Dashboard',
    icon: <DashboardOutlined />,
    url: '/',
  },
  {
    key: 1,
    title: 'Entities',
    icon: <UnorderedListOutlined />,
    isAuthenticated: true,
    child: [
      {
        key: 101,
        title: 'Category',
        icon: <DatabaseOutlined />,
        url: '/entity/category',
      },
      {
        key: 102,
        title: 'Post',
        icon: <FileTextOutlined />,
        url: '/entity/post',
      },
      {
        key: 103,
        title: 'Challenge',
        icon: <FileTextOutlined />,
        url: '/entity/challenge',
      },
    ],
  },
  {
    key: 2,
    title: 'Administration',
    icon: <RobotOutlined />,
    isAuthenticated: true,
    isAdmin: true,
    child: [
      {
        key: 201,
        title: 'User management',
        icon: <TeamOutlined />,
        url: '/admin/user-management',
      },
      {
        key: 202,
        title: 'Metrics',
        icon: <MonitorOutlined />,
        url: '/admin/metrics',
      },
      {
        key: 203,
        title: 'Health management',
        icon: <HeartOutlined />,
        url: '/admin/health',
      },
      {
        key: 204,
        title: 'Configuration',
        icon: <ControlOutlined />,
        url: '/admin/configuration',
      },
      {
        key: 205,
        title: 'Logs',
        icon: <CodeOutlined />,
        url: '/admin/logs',
      },
      {
        key: 206,
        title: 'API',
        icon: <ApiOutlined />,
        url: '/admin/docs',
      },
    ],
  },
];
