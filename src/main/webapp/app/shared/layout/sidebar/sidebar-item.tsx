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
  TrophyOutlined,
  FallOutlined,
  DingtalkOutlined
} from "@ant-design/icons";

export const menuItems = [
  {
    key: 0,
    title: "Dashboard",
    icon: <DashboardOutlined/>,
    url: "/"
  },
  {
    key: 1,
    title: "Entities",
    icon: <UnorderedListOutlined/>,
    isAuthenticated: true,
    child: [
      {
        key: 101,
        title: "Category",
        icon: <DatabaseOutlined />,
        url: "/entity/category"
      },
      {
        key: 102,
        title: "Post",
        icon: <FileTextOutlined />,
        url: "/entity/post"
      },
      {
        key: 103,
        title: "CFG Level Info",
        icon: <TrophyOutlined />,
        url: "/entity/cfglevelinfo"
      },
      {
        key: 104,
        title: "CFG VO2 Rule",
        icon: <FallOutlined />,
        url: "/entity/cfgvo2rule"
      },
      {
        key: 105,
        title: "CFG VO2 Challenge Rule",
        icon: <DingtalkOutlined />,
        url: "/entity/cfgvo2challengerule"
      }
    ]
  },
  {
    key: 2,
    title: "Administration",
    icon: <RobotOutlined/>,
    isAuthenticated: true,
    isAdmin: true,
    child: [
      {
        key: 201,
        title: "User management",
        icon: <TeamOutlined/>,
        url: "/admin/user-management"
      },
      {
        key: 202,
        title: "Metrics",
        icon: <MonitorOutlined/>,
        url: "/admin/metrics"
      },
      {
        key: 203,
        title: "Health management",
        icon: <HeartOutlined/>,
        url: "/admin/health"
      },
      {
        key: 204,
        title: "Configuration",
        icon: <ControlOutlined/>,
        url: "/admin/configuration"
      },
      {
        key: 205,
        title: "Logs",
        icon: <CodeOutlined/>,
        url: "/admin/logs"
      },
      {
        key: 206,
        title: "API",
        icon: <ApiOutlined/>,
        url: "/admin/docs"
      },
    ]
  },
]
