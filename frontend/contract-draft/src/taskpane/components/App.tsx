import * as React from "react";
import { DefaultButton, Dropdown, TextField, DatePicker, MessageBar, MessageBarType } from "@fluentui/react";
import { HashLoader } from 'react-spinners';
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import Progress from "./Progress";

/* global Word, require */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
  agreementType: string | number | undefined;
  governingLaw: string | number | undefined;
  partyA: string;
  partyB: string;
  effectiveDate: Date | null | undefined;
  formValid: boolean;
  isGenerating: boolean;
  errorMessage: string | null;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      listItems: [],
      agreementType: undefined,
      governingLaw: undefined,
      partyA: '',
      partyB: '',
      effectiveDate: null,
      formValid: false,
      isGenerating: false,
      errorMessage: null,
    };
  }

  validateName = (name: string) => {
    const regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g;
    return regex.test(name);
  };

  validateForm = () => {
    const { agreementType, governingLaw, partyA, partyB, effectiveDate } = this.state;
    if (agreementType && governingLaw && this.validateName(partyA) && this.validateName(partyB) && effectiveDate) {
      this.setState({ formValid: true });
    } else {
      this.setState({ formValid: false });
    }
  };

  formatDate = (date: Date): string => {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [month, day, year].join('-');
  }

  generateDraft = async () => {
    const { agreementType, governingLaw, partyA, partyB, effectiveDate } = this.state;
    this.setState({ isGenerating: true, errorMessage: null }); // Reset error message
    const formattedDate = this.formatDate(effectiveDate);
    try {
      // Calling the backend API
      const response = await fetch('http://localhost:8000/api/draft', {
        method: 'POST',
        body: JSON.stringify({
          "agreement_type": agreementType,
          "governing_law": governingLaw,
          "party_a": partyA,
          "party_b": partyB,
          "effective_date": formattedDate,
        })
      });

      const responseData = await response.json();
      this.setState({ isGenerating: false })

      // Cleaning the data
      let message = responseData.message;
      console.log("message", message)
      message = message.replace(/\\n/g, '\n');
      message = message.replace(/\\"/g, '"');
      message = message.replace(/\\“/g, '“');
      message = message.replace(/\\”/g, '”');
      message = message.replace(/\\,/g, ',');
      message = message.replace(/^\"|\"$/g, '');
      message = message.replace(/\\u201c/g, '“');
      message = message.replace(/\\u201d/g, '”');
      message = message.replace(/},/g, ',');
      message = message.replace(/\\u/g, '');

      // Inserting formatted contract into Word
      return Word.run(async (context) => {
        const lines = message.split('\n');
        lines.forEach((line, index) => {
          let para = context.document.body.insertParagraph(line, Word.InsertLocation.end);
          para.font.name = 'Times New Roman';
          if (index === 0) {
            para.alignment = Word.Alignment.centered;
            para.font.bold = true;
          }
          else {
            para.alignment = Word.Alignment.left;
            para.font.bold = false;
          }
        });

        await context.sync();
      });

    } catch (error) {
      this.setState({ isGenerating: false, errorMessage: error.message });
      return;
    }

  };

  componentDidMount() { }

  render() {
    const { title, isOfficeInitialized } = this.props;
    const { isGenerating, errorMessage } = this.state;
    const agreementOptions = [
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


    const lawOptions = [
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

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your add-in to see app body."
        />
      );
    }

    return (
      <div className="ms-welcome">
        <Header title={this.props.title} message="Contract Drafter" />

        <HeroList message="" items={this.state.listItems}>

          {isGenerating ? (
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
              {errorMessage && (
                <MessageBar
                  messageBarType={MessageBarType.error}
                  isMultiline={false}
                  onDismiss={() => this.setState({ errorMessage: null })}
                  dismissButtonAriaLabel="Close"
                >
                  {errorMessage}
                </MessageBar>
              )}
            </div>

          )}
        </HeroList>
      </div>
    );
  }
}
