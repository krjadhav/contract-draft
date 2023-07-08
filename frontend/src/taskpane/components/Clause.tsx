import React, { Component, ChangeEvent } from 'react';
import { TextField, DefaultButton, Icon } from "@fluentui/react";
import { HashLoader } from 'react-spinners';

interface ClauseProps {
    handleBackClick: () => void;
    prompt: string;
    handlePromptChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleGenerateClause: () => void;
    isGenerating: boolean;
}

class Clause extends Component<ClauseProps> {
    render() {
        const { handleBackClick, prompt, handlePromptChange, handleGenerateClause, isGenerating } = this.props;
        return (
            <>
                {isGenerating ? (
                    <div className="centerContent">
                        <HashLoader color={"#005a9e"} size={40} />
                        <p className="ms-font-xl ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20">Generating Clause...</p>
                    </div>
                ) : (
                    <>
                        <div className="ms-font-xl ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20 paragraphStyles" onClick={handleBackClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Icon iconName='ChevronLeft' />
                            <p style={{ margin: 0 }}>Back</p>
                        </div>
                        <p className="ms-font-xl ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20 paragraphStyles">Provide a prompt to add clause</p>
                        <TextField className="ms-font-l inputFields" label="Prompt" value={prompt} onChange={handlePromptChange} />
                        <DefaultButton className="ms-font-l ms-welcome__action buttonStyles" text="Generate clause" onClick={handleGenerateClause} />
                    </>
                )}
            </>
        );
    }
};

export default Clause;
