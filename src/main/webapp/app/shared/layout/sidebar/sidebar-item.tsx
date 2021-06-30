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
  QuestionCircleOutlined,
  EditOutlined,
  ReadOutlined,
} from '@ant-design/icons';

export const menuItems = [
  {
    key: 1,
    title: 'Admin',
    icon: <RobotOutlined />,
    isAuthenticated: true,
    isAdmin: true,
    child: [
      {
        key: 101,
        title: 'User Management',
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
        title: 'Health',
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
        title: 'API docs',
        icon: <ApiOutlined />,
        url: '/admin/docs',
      },
      {
        key: 107,
        title: 'News Category',
        icon: <ReadOutlined />,
        isAuthenticated: true,
        isAdmin: true,
        url: '/news-category',
      },
    ],
  },
  {
    key: 2,
    title: 'Trang chủ',
    icon: <DashboardOutlined />,
    isAuthenticated: true,
    url: '/',
  },
  {
    key: 3,
    title: 'Quản lý khách hàng',
    icon: <TeamOutlined />,
    isAuthenticated: true,
    url: '/users',
  },
  {
    key: 4,
    title: 'Quản lý tin tức',
    icon: <EditOutlined />,
    url: '/news',
    isAuthenticated: true,
  },
  {
    key: 5,
    title: 'FAQ, Hướng dẫn',
    icon: <QuestionCircleOutlined />,
    url: '/faqs',
    isAuthenticated: true,
  },
];
