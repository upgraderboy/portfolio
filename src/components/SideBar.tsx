"use client";
import { X } from "lucide-react";
import NavigationLinks from "./NavigationLinks";
import Icon from "./Icon";
import store from "@/store/store";

const SideBar = () => {
  const { isOpen, toggleNav } = store.useNavigationStore();
  return (
    <>
      {isOpen && (
        <aside className="sidebar">
          <div className="sidebar__wrapper">
            <div className="flex justify-center items-center p-4 top">
              <div className="logo">
                <Icon name="logo" width={100} height={100} />
              </div>
              <div className="icon__container" id="close-sidebar-btn">
                <X onClick={() => toggleNav()} />
              </div>
            </div>
            <NavigationLinks name="navitem" />
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: "14px",
              marginTop: "2rem",
            }}
          >
            <span className="gradient__text" style={{ fontWeight: 700 }}>
              Upgrader Boy
            </span>
          </p>
        </aside>
      )}
    </>
  );
};

export default SideBar;
