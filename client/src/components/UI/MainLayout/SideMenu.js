import { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  WalletOutlined,
  UserOutlined,
  TeamOutlined,
  LoginOutlined,
  DashboardOutlined,
  LineChartOutlined,
  StockOutlined,
  SwapOutlined,
  ExclamationCircleOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Modal } from 'antd';
import authContext from '../../../context/auth/authContext';
import Icon from '../../UI/Icon/Icon';
const { Sider } = Layout;

const SideMenu = () => {
  const { logout, isAdmin } = useContext(authContext);
  
  console.log(isAdmin);
  const confirm = () => {
    Modal.confirm({
      title: 'Log Out',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure, you want to logout?',
      okText: 'Log Out',
      cancelText: 'Cancel',
      onOk() {
        Modal.destroyAll();
        logout();
      },
    });
  };

  const currPath = window.location.pathname;
  return (
    <Sider
      className="main-layout__aside"
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {}}
      onCollapse={(collapsed, type) => {}}
      width="300"
    >
      <div className="logo">Terminal Trends</div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['4']}
        style={{ width: '300px', paddingLeft: '30px', fontSize: '17px' }}
        className="main-layout__menu"
      >
        {!isAdmin && (
          <Menu.Item
            key="9"
            icon={
              <Icon active={currPath === '/activity' ? true : false}>
                <LineChartOutlined style={{ fontSize: '18px' }} />
              </Icon>
            }
            className="main-layout__menu-item"
            style={{ width: '200px', height: '50px' }}
          >
            <Link to="/activity">Activity</Link>
          </Menu.Item>
        )}
        {isAdmin && (
          <>
            {' '}
            <Menu.Item
              key="1"
              icon={
                <Icon active={currPath === '/dashboard' ? true : false}>
                  <DashboardOutlined style={{ fontSize: '18px' }} />
                </Icon>
              }
              className="main-layout__menu-item"
              style={{ width: '200px', height: '50px' }}
            >
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={
                <Icon active={currPath.includes('/employees')}>
                  <TeamOutlined style={{ fontSize: '18px' }} />
                </Icon>
              }
              className="main-layout__menu-item"
              style={{ width: '200px', height: '50px' }}
            >
              <Link to="/employees">Employees</Link>
            </Menu.Item>
          </>
        )}
        <Menu.Item
          key="5"
          icon={
            <Icon active={currPath.includes('/requests')}>
              <SwapOutlined style={{ fontSize: '18px' }} />
            </Icon>
          }
          className="main-layout__menu-item"
          style={{ width: '200px', height: '50px' }}
        >
          <Link to="/requests">Requests</Link>
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={
            <Icon active={currPath === '/salary' ? true : false}>
              <WalletOutlined style={{ fontSize: '18px' }} />
            </Icon>
          }
          className="main-layout__menu-item"
          style={{ width: '200px', height: '50px' }}
        >
          <Link to="/salary">Salary</Link>
        </Menu.Item>

        {!isAdmin && (
          <Menu.Item
            key="11"
            icon={
              <Icon active={currPath === '/deductions' ? true : false}>
                {/* <LineChartOutlined style={{ fontSize: '18px' }} /> */}
                <FallOutlined style={{ fontSize: '18px' }} />
              </Icon>
            }
            className="main-layout__menu-item"
            style={{ width: '200px', height: '50px' }}
          >
            <Link to="/deductions">Deductions</Link>
          </Menu.Item>
        )}

        <div className="sub-heading">Account Pages</div>
        {isAdmin && (
          <Menu.Item
            key="12"
            icon={
              <Icon active={currPath === '/organization' ? true : false}>
                <UserOutlined style={{ fontSize: '18px' }} />
              </Icon>
            }
            className="main-layout__menu-item"
            style={{ width: '200px', height: '50px' }}
          >
            <Link to="/organization">Organization</Link>
          </Menu.Item>
        )}

        <Menu.Item
          key="8"
          icon={
            <Icon active={currPath === '/profile' ? true : false}>
              <UserOutlined style={{ fontSize: '18px' }} />
            </Icon>
          }
          className="main-layout__menu-item"
          style={{ width: '200px', height: '50px' }}
        >
          <Link to="/profile">Profile</Link>
        </Menu.Item>

        <Menu.Item
          key="10"
          onClick={confirm}
          icon={
            <Icon active={false}>
              <LoginOutlined style={{ fontSize: '18px' }} />
            </Icon>
          }
          className="main-layout__menu-item"
          style={{ width: '200px', height: '50px' }}
        >
          Log Out
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SideMenu;
