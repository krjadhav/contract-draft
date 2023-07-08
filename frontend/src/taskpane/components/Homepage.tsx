import * as React from "react";
import { DefaultButton } from "@fluentui/react";

interface HomepageProps {
    handleViewLibrary: () => void;
    handleClause: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ handleViewLibrary, handleClause }) => {
    return (
        <>
            <p className="ms-font-xl ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20 paragraphStyles">What do you want to do with Contract Drafter?</p>
            <DefaultButton className="ms-font-l ms-welcome__action buttonStyles" iconProps={{ iconName: "TextDocument" }} text="Draft Contracts" />
            <DefaultButton className="ms-font-l ms-welcome__action buttonStyles" iconProps={{ iconName: "Library" }} text="View Library" onClick={handleViewLibrary} />
            <DefaultButton className="ms-font-l ms-welcome__action buttonStyles" iconProps={{ iconName: "Handwriting" }} text="Add clauses" onClick={handleClause} />
        </>
    );
};

export default Homepage;
