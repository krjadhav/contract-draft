import * as React from "react";

export interface HeaderProps {
  title: string;
  message: string;
}

export default class Header extends React.Component<HeaderProps> {
  render() {
    const { title, message } = this.props;

    return (
      <section className="ms-welcome__header ms-bgColor-themeDark ms-u-fadeIn500">
        <h1 className="ms-fontSize-su ms-fontWeight-light ms-fontColor-white">{message}</h1>
      </section>
    );
  }
}
