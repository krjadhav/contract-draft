import * as React from "react";

export interface HeroListItem {
  icon: string;
  primaryText: string;
}

export interface HeroListProps {
  message: string;
  items: HeroListItem[];
  children: any;
}

export default class HeroList extends React.Component<HeroListProps> {
  render() {
    const { children, items, message } = this.props;
    return (
      <main className="ms-welcome__main">
        <h2 className="ms-font-xl ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20">{message}</h2>
        {children}
      </main>
    );
  }
}
