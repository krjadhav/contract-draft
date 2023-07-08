import React, { Component } from 'react';
import { Dropdown, TextField, DatePicker, DefaultButton } from "@fluentui/react";
import HashLoader from 'react-spinners/HashLoader';

interface State {
    isGenerating: boolean;
    agreementType: string | number | undefined;
    governingLaw: string | number | undefined;
    partyA: string;
    partyB: string;
    effectiveDate: Date | undefined;
    formValid: boolean;
}

interface Option {
    key: string | number;
    text: string;
}

const agreementOptions: Option[] = [
    { key: 'non-disclosure agreement', text: 'Non-disclosure Agreement' },
    { key: 'lease agreement', text: 'Lease Agreement' },
    { key: 'employment contract', text: 'Employment Contract' },
    { key: 'affiliate agreement', text: 'Affiliate Agreement' },
    { key: 'agency agreement', text: 'Agency Agreement' },
    { key: 'cobranding agreement', text: 'Cobranding Agreement' },
    { key: 'collaboration agreement', text: 'Collaboration Agreement' },
    { key: 'consulting agreement', text: 'Consulting Agreement' },
    { key: 'development agreement', text: 'Development Agreement' },
    { key: 'distributor agreement', text: 'Distributor Agreement' },
    { key: 'endorsement agreement', text: 'Endorsement Agreement' },
    { key: 'hosting agreement', text: 'Hosting Agreement' },
    { key: 'ip agreement', text: 'IP Agreement' },
    { key: 'indemnification agreement', text: 'Indemnification Agreement' },
    { key: 'investment advisory agreement', text: 'Investment Advisory Agreement' },
    { key: 'joint venture agreement', text: 'Joint Venture Agreement' },
    { key: 'license agreement', text: 'License Agreement' },
    { key: 'maintenance agreement', text: 'Maintenance Agreement' },
    { key: 'manufacturing agreement', text: 'Manufacturing Agreement' },
    { key: 'marketing agreement', text: 'Marketing Agreement' },
    { key: 'master services agreement', text: 'Master Services Agreement' },
    { key: 'mortgage agreement', text: 'Mortgage Agreement' },
    { key: 'non disclosure agreement', text: 'Non Disclosure Agreement' },
    { key: 'non-compete agreement', text: 'Non-Compete Agreement' },
    { key: 'outsourcing agreement', text: 'Outsourcing Agreement' },
    { key: 'promotion agreement', text: 'Promotion Agreement' },
    { key: 'reseller agreement', text: 'Reseller Agreement' },
    { key: 'service agreement', text: 'Service Agreement' },
    { key: 'share purchase agreement', text: 'Share Purchase Agreement' },
    { key: 'sponsorship agreement', text: 'Sponsorship Agreement' },
    { key: 'stock options agreement', text: 'Stock Options Agreement' },
    { key: 'strategic alliance agreement', text: 'Strategic Alliance Agreement' },
    { key: 'subscription agreement', text: 'Subscription Agreement' },
    { key: 'supply agreement', text: 'Supply Agreement' },
    { key: 'transportation agreement', text: 'Transportation Agreement' },
    { key: 'underwriting agreement', text: 'Underwriting Agreement' },
];

const lawOptions: Option[] = [
    { key: 'Alabama', text: 'Alabama' },
    { key: 'Alaska', text: 'Alaska' },
    { key: 'Arizona', text: 'Arizona' },
    { key: 'Arkansas', text: 'Arkansas' },
    { key: 'California', text: 'California' },
    { key: 'Colorado', text: 'Colorado' },
    { key: 'Connecticut', text: 'Connecticut' },
    { key: 'Delaware', text: 'Delaware' },
    { key: 'Florida', text: 'Florida' },
    { key: 'Georgia', text: 'Georgia' },
    { key: 'Hawaii', text: 'Hawaii' },
    { key: 'Idaho', text: 'Idaho' },
    { key: 'Illinois', text: 'Illinois' },
    { key: 'Indiana', text: 'Indiana' },
    { key: 'Iowa', text: 'Iowa' },
    { key: 'Kansas', text: 'Kansas' },
    { key: 'Kentucky', text: 'Kentucky' },
    { key: 'Louisiana', text: 'Louisiana' },
    { key: 'Maine', text: 'Maine' },
    { key: 'Maryland', text: 'Maryland' },
    { key: 'Massachusetts', text: 'Massachusetts' },
    { key: 'Michigan', text: 'Michigan' },
    { key: 'Minnesota', text: 'Minnesota' },
    { key: 'Mississippi', text: 'Mississippi' },
    { key: 'Missouri', text: 'Missouri' },
    { key: 'Montana', text: 'Montana' },
    { key: 'Nebraska', text: 'Nebraska' },
    { key: 'Nevada', text: 'Nevada' },
    { key: 'New Hampshire', text: 'New Hampshire' },
    { key: 'New Jersey', text: 'New Jersey' },
    { key: 'New Mexico', text: 'New Mexico' },
    { key: 'New York', text: 'New York' },
    { key: 'North Carolina', text: 'North Carolina' },
    { key: 'North Dakota', text: 'North Dakota' },
    { key: 'Ohio', text: 'Ohio' },
    { key: 'Oklahoma', text: 'Oklahoma' },
    { key: 'Oregon', text: 'Oregon' },
    { key: 'Pennsylvania', text: 'Pennsylvania' },
    { key: 'Rhode Island', text: 'Rhode Island' },
    { key: 'South Carolina', text: 'South Carolina' },
    { key: 'South Dakota', text: 'South Dakota' },
    { key: 'Tennessee', text: 'Tennessee' },
    { key: 'Texas', text: 'Texas' },
    { key: 'Utah', text: 'Utah' },
    { key: 'Vermont', text: 'Vermont' },
    { key: 'Virginia', text: 'Virginia' },
    { key: 'Washington', text: 'Washington' },
    { key: 'West Virginia', text: 'West Virginia' },
    { key: 'Wisconsin', text: 'Wisconsin' },
    { key: 'Wyoming', text: 'Wyoming' },
];

class Draft extends Component<{}, State> {
    state: State = {
        isGenerating: false,
        agreementType: undefined,
        governingLaw: undefined,
        partyA: '',
        partyB: '',
        effectiveDate: undefined,
        formValid: false,
    };

    validateForm = () => {
        /* Validation logic here */
    };

    generateDraft = () => {
        /* Draft generation logic here */
    };

    render() {
        return this.state.isGenerating ? (
            <div className="centerContent">
                <HashLoader color={"#005a9e"} size={40} />
                <p className="ms-font-xl ms-fontWeight-semilight ms-fontColor-neutralPrimary ms-u-slideUpIn20">Generating Draft...</p>
            </div>
        ) : (
            <div>
                <div className="inputFieldsContainer">
                    <Dropdown
                        className="inputField"
                        placeholder="Select an Agreement Type"
                        label="Agreement Type"
                        options={agreementOptions}
                        selectedKey={this.state.agreementType}
                        onChange={(_, option) => {
                            this.setState({ agreementType: option?.key }, this.validateForm);
                        }}
                        required
                    />
                    <Dropdown
                        className="inputField"
                        placeholder="Select a Governing Law"
                        label="Governing Law"
                        options={lawOptions}
                        selectedKey={this.state.governingLaw}
                        onChange={(_, option) => {
                            this.setState({ governingLaw: option?.key }, this.validateForm);
                        }}
                        required
                    />
                    <TextField
                        className="inputField"
                        label="Party A Involved"
                        value={this.state.partyA}
                        onChange={(_, newValue) => {
                            this.setState({ partyA: newValue || '' }, this.validateForm);
                        }}
                        required
                    />
                    <TextField
                        className="inputField"
                        label="Party B Involved"
                        value={this.state.partyB}
                        onChange={(_, newValue) => {
                            this.setState({ partyB: newValue || '' }, this.validateForm);
                        }}
                        required
                    />
                    <DatePicker
                        className="inputField datePickerWithMargin"
                        label="Contract Effective Date"
                        value={this.state.effectiveDate}
                        onSelectDate={(date) => {
                            this.setState({ effectiveDate: date }, this.validateForm);
                        }}
                    />
                </div>
                <DefaultButton className="ms-welcome__action" iconProps={{ iconName: "ChevronRight" }} onClick={this.generateDraft} disabled={!this.state.formValid}>
                    Generate Draft
                </DefaultButton>
            </div>
        );
    }
}

export default Draft;
