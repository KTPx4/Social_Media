import { Avatar } from "primereact/avatar";

import { Button } from "primereact/button";

import { Image } from "primereact/image";

import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import MenuBar from "../../components/MenuBar";

import { Menubar } from "primereact/menubar";

const EditProfilePage = () => {
  const items = [
    {
      label: "Home",

      icon: "pi pi-home",
    },

    {
      label: "Features",

      icon: "pi pi-star",
    },

    {
      label: "Projects",

      icon: "pi pi-search",

      items: [
        {
          label: "Components",

          icon: "pi pi-bolt",
        },

        {
          label: "Blocks",

          icon: "pi pi-server",
        },

        {
          label: "UI Kit",

          icon: "pi pi-pencil",
        },

        {
          label: "Templates",

          icon: "pi pi-palette",

          items: [
            {
              label: "Apollo",

              icon: "pi pi-palette",
            },

            {
              label: "Ultima",

              icon: "pi pi-palette",
            },
          ],
        },
      ],
    },

    {
      label: "Contact",

      icon: "pi pi-envelope",
    },
  ];

  return (
    <div className="flex-column h-screen w-screen ">
      {" "}
      <div className="flex  h-3rem w-3rem bg-gray-200  border-round-md"></div>{" "}
      <div className="flex w-full h-auto">
        {" "}
        <div className="w-full h-full flex justify-content-center align-items-center w-4">
          {" "}
          <img
            src="https://fastly.picsum.photos/id/808/536/354.jpg?hmac=Wj27FehH0gnLQFDE1TwjgdDrLIByp-1dOSh9UznzPyw"
            className="border-circle w-17rem h-17rem  m-2 bg-primary font-bold flex align-items-center justify-content-center"
          ></img>{" "}
        </div>{" "}
        <div className="h-auto w-full flex-column pl-8 pb-4 pt-4 w-11">
          {" "}
          <div className="flex gap-4">
            <p>phucnguyenhoang3839</p>{" "}
            <div className="flex gap-2">
              {" "}
              <Button size="small" label="Edit profile">
                {" "}
              </Button>
              <Button size="small" label="View archive"></Button>{" "}
              <Button
                icon="pi pi-spin pi-cog"
                rounded
                text
                aria-label="Filter"
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex justify-content-between w-4">
            {" "}
            <p>
              <span className="font-bold"> 3 </span>
              post{" "}
            </p>{" "}
            <p>
              <span className="font-bold"> 3 </span> followers{" "}
            </p>{" "}
            <p>
              <span className="font-bold"> 3 </span> following{" "}
            </p>{" "}
          </div>
          <p className="font-bold">Phuc Nguyen</p> <p>hello every one </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="w-full flex gap-3 h-auto pl-4 pb-4 pt-4">
        {" "}
        <div>
          {" "}
          <Avatar
            image="https://picsum.photos/id/121/200/300.jpg"
            size="xlarge"
            shape="circle"
          />{" "}
          <p>asdsadsa</p>{" "}
        </div>{" "}
        <div>
          {" "}
          <Avatar
            image="https://picsum.photos/id/11/200/300.jpg"
            size="xlarge"
            shape="circle"
          />{" "}
          <p>asdsadsa</p>{" "}
        </div>{" "}
        <div>
          {" "}
          <Avatar
            image="https://picsum.photos/id/12/200/300.jpg"
            size="xlarge"
            shape="circle"
          />{" "}
          <p>asdsadsa</p>{" "}
        </div>{" "}
        <div>
          {" "}
          <Avatar
            image="https://picsum.photos/id/21/200/300.jpg"
            size="xlarge"
            shape="circle"
          />{" "}
          <p>asdsadsa</p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="h-auto w-full">
        <Menubar model={items} />{" "}
      </div>
    </div>
  );
};

export default EditProfilePage;
