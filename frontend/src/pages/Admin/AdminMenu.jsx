import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminMenu = () => {
  const items = [
    {
      key: "admindashboard",
      label: "Admin Dashboard",
      link: "/admin/dashboard",
    },
    {
      key: "createcategory",
      label: "Create Category",
      link: "/admin/categorylist",
    },
    {
      key: "createproduct",
      label: "Create Product",
      link: "/admin/productlist",
    },
    {
      key: "allproduct",
      label: "All Products",
      link: "/admin/allproductslist",
    },
    {
      key: "userlist",
      label: "Manage Users",
      link: "/admin/userlist",
    },
    {
      key: "orderlist",
      label: "Manage Orders",
      link: "/admin/orderlist",
    },
  ];

  return (
    <div className="absolute top-5 right-20">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">
            <FaBars size={30} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Dynamic Actions" items={items}>
          {(item) => (
            <DropdownItem
              key={item.key}
              color={item.key === "delete" ? "danger" : "default"}
              className={item.key === "delete" ? "text-danger" : ""}
              textValue={item.label}
            >
              <Link to={item.link} className="w-full h-full block">
                {item.label}
              </Link>
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default AdminMenu;
