import React from "react";
import "./Navbar.scss";
import { Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const { logout, currentUser } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout().then(() => {
      history.push("/");
    });
  };

  const menu = (
    <Menu key="1">
      <Menu.Item className="navbar__dropdownOption" onClick={handleLogout}>
        <LogoutOutlined />
        <span style={{ marginLeft: "0.4rem" }}>Logout</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar">
      <ul className="navbar__navigations">
        <li>
          <NavLink
            activeClassName="navbar__activeNavLink"
            exact={true}
            to="/dashboard"
          >
            DASHBOARD
          </NavLink>
        </li>
        <li>
          <NavLink
            activeClassName="navbar__activeNavLink"
            exact={true}
            to="/portfolio"
          >
            PORTFOLIO
          </NavLink>
        </li>
      </ul>
      <div className="navbar__userInfo">
        <Dropdown overlay={menu}>
          <div className="navbar__dropdown">
            <p>Hi, {currentUser?.displayName}</p>
            <Avatar>
              <UserOutlined />
            </Avatar>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
