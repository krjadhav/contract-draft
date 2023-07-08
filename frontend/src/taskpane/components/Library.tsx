import * as React from "react";
import { Icon, DefaultButton } from "@fluentui/react";

interface LibraryProps {
    handleBackClick: () => void;
    handleAddTextToWord: (contract_id: string) => void;
    saveDocContent: () => void;
    historyData: { created_at: string; id: string }[];
}

const Library: React.FC<LibraryProps> = ({
    handleBackClick,
    handleAddTextToWord,
    saveDocContent,
    historyData,
}) => {
    return (
        <>
            <div
                className="ms-font-xl ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20 paragraphStyles"
                onClick={handleBackClick}
                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
                <Icon iconName="ChevronLeft" />
                <p style={{ margin: 0 }}>Back</p>
            </div>
            <p className="ms-font-xl ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20 paragraphStyles">
                <b>Restore</b> previous versions or <b>Save</b> current version
            </p>
            {historyData.map((item) => (
                <DefaultButton
                    className="ms-font-l ms-welcome__action docHistory"
                    iconProps={{ iconName: "History" }}
                    key={item.created_at}
                    text={item.created_at}
                    onClick={() => handleAddTextToWord(item.id)}
                />
            ))}
            <DefaultButton
                className="ms-font-l ms-welcome__action buttonStyles"
                iconProps={{ iconName: "Save" }}
                text="Save"
                onClick={saveDocContent}
            />
        </>
    );
};

export default Library;
