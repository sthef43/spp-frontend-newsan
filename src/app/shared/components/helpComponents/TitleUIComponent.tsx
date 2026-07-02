import classNames from "classnames";
import React from "react";

interface props {
  title: string;
  classNameDiv?: string;
  classNameTitle?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function TitleUIComponent(props: props) {
  return (
    <div
      className={classNames(
        `${
          props.classNameDiv ? "" : "my-2 mx-4"
        } bg-gradient-to-r from-newsan from-20% via-newsanColorMidSubtitle via-50% to-newsan to-80% shadow-elevation-8 rounded-md text-gray-900 text-2xl dark:text-gray-200`,
        props.classNameDiv
      )}>
      <div className={classNames("rounded-xl text-center px-4 py-2 text-gray-50", props.classNameTitle || "")}>
        <h1>{props.title}</h1>
      </div>
    </div>
  );
}
