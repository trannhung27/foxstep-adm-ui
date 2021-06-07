import React from 'react';

import {
  Button,
  Collapse,
  DropdownMenu,
  DropdownToggle,
  Media,
  Nav, Navbar, NavbarBrand,
  NavbarToggler, NavItem,
  NavLink, UncontrolledCollapse,
  UncontrolledDropdown
} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export const NavDropdown = props => (
  <UncontrolledDropdown nav inNavbar id={props.id} data-cy={props['data-cy']}>
    <DropdownToggle nav caret className="d-flex align-items-center text-light">
      {props.avatar ?
        <Media className="align-items-center pr-2">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={props.avatar}
                  />
                </span>
        </Media>
        : <FontAwesomeIcon icon={props.icon} className="m-sm-1"/>
      }
      <span className="text-capitalize">{props.name}</span>
    </DropdownToggle>
    <DropdownMenu right style={props.style}>
      {props.children}
    </DropdownMenu>
  </UncontrolledDropdown>
);
