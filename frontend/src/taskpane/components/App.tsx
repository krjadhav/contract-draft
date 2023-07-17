import * as React from "react";
import Header from "./Header";
import Progress from "./Progress";
import Login from './Login';
import Homepage from './Homepage';
import Library from './Library';
import Clause from './Clause';
import Draft from './Draft';

/* global Word, require */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  errorMessage: string | null;
  email: string;
  password: string;
  prompt: string;
  isSignedIn: boolean;
  showHomepage: boolean;
  showLibrary: boolean;
  showClause: boolean;
  showDraft: boolean;
  historyData: HistoryData[];
  isGenerating: boolean;
  token: string;
  agreementType: string | number | undefined;
  governingLaw: string | number | undefined;
  partyA: string;
  partyB: string;
  effectiveDate: Date | null | undefined;
  formValid: boolean;
}

export interface HistoryData {
  created_at: string;
  text: string;
}


export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      errorMessage: null,
      email: '',
      password: '',
      prompt: '',
      agreementType: undefined,
      governingLaw: undefined,
      partyA: '',
      partyB: '',
      effectiveDate: null,
      token: '',
      formValid: false,
      isSignedIn: false,
      showHomepage: false,
      showLibrary: false,
      showClause: false,
      showDraft: false,
      isGenerating: false,
      historyData: [],
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

  handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  handleSignIn = async () => {
    const url = "/api/auth";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.state.email, password: this.state.password })
      });

      if (!response.ok) throw new Error("Error during sign in");

      const result = await response.json();
      if (!result.access_token) throw new Error(result.message);

      this.setState({ isSignedIn: true, showHomepage: true, token: result.access_token });
    } catch (error) {
      console.error(error);
      this.setState({ errorMessage: error.message });
    }
  };


  handleViewLibrary = async () => {
    try {
      const response = await fetch("/api/contracts", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${this.state.token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error("Error fetching contracts");

      const result = await response.json();

      this.setState({ showLibrary: true, showHomepage: false, showClause: false, historyData: result });
    } catch (error) {
      console.error(error);
      this.setState({ errorMessage: error.message });
    }
  };


  handleClause = () => {
    this.setState({ showClause: true, showHomepage: false, showLibrary: false });
  }

  handleBackClick = () => {
    this.setState({ showHomepage: true, showClause: false, showLibrary: false });
  };

  handleAddTextToWord = async (contract_id: string) => {
    try {
      const response = await fetch(`/api/contract/${contract_id}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${this.state.token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error("Error fetching contract text");

      const result = await response.json();
      const message = result.text;

      const lines = message.split('\n');

      await Word.run(async (context) => {
        lines.forEach((line, index) => {
          let para = context.document.body.insertParagraph(line, Word.InsertLocation.end);
          para.font.name = 'Times New Roman';
          if (index === 0) {
            para.alignment = Word.Alignment.centered;
            para.font.bold = true;
          } else {
            para.alignment = Word.Alignment.left;
            para.font.bold = false;
          }
        })
      });
    } catch (error) {
      console.error(error);
      // Handle error accordingly
    }
  };


  saveDocContent = async () => {
    await Word.run(async (context) => {
      const body = context.document.body;
      context.load(body, 'text');
      await context.sync();

      const url = `/api/contract/save`;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${this.state.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "text": body.text })
        });

      } catch (error) {
        console.error(error);
      }
    });
  }


  handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ prompt: event.target.value });
  };

  handleGenerateClause = async () => {
    this.setState({ isGenerating: true });

    // The API request options, including the method and headers
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.token}`
      },
      body: JSON.stringify({ "text": this.state.prompt })
    };

    try {
      // Make the API call
      const response = await fetch('/api/contracts/clauses', requestOptions);

      // If the response is not ok, throw an error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the data from the response
      const data = await response.json();

      // Check if the response has the expected format
      if (data && data.message) {
        // Insert the clause to Word
        await this.insertClause(data.message);
        this.setState({ isGenerating: false, prompt: '' }); // clear the TextField
      } else {
        // If the response does not have the expected format, throw an error
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      // If any error happens, update the error message state
      this.setState({ errorMessage: error.message });
    }
  };


  insertClause = async (clause: string) => {
    await Word.run(context => {
      const range = context.document.getSelection();
      range.insertText(clause, Word.InsertLocation.start);
      return context.sync();
    });
  };


  componentDidMount() { }

  render() {
    const { title, isOfficeInitialized } = this.props;

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
        <main className="ms-welcome__main">
          {/* Sign In Page */}
          {!this.state.isSignedIn &&
            <Login
              email={this.state.email}
              password={this.state.password}
              handleEmailChange={this.handleEmailChange}
              handlePasswordChange={this.handlePasswordChange}
              handleSignIn={this.handleSignIn}
            />
          }

          {/* Homepage */}
          {this.state.isSignedIn && this.state.showHomepage &&
            <Homepage
              handleViewLibrary={this.handleViewLibrary}
              handleClause={this.handleClause}
            />
          }

          {/* View Library */}
          {this.state.isSignedIn && this.state.showLibrary &&
            <Library
              handleBackClick={this.handleBackClick}
              handleAddTextToWord={this.handleAddTextToWord}
              saveDocContent={this.saveDocContent}
              historyData={this.state.historyData}
            />
          }
          {/* Add Clause */}
          {this.state.isSignedIn && this.state.showClause &&
            <Clause
              handleBackClick={this.handleBackClick}
              prompt={this.state.prompt}
              handlePromptChange={this.handlePromptChange}
              handleGenerateClause={this.handleGenerateClause}
              isGenerating={this.state.isGenerating}
            />
          }

          {/* Draft Contract */}
          {this.state.isSignedIn && this.state.showDraft &&
            <Draft
              isGenerating={this.state.isGenerating}
              errorMessage={this.state.errorMessage}
              agreementType={this.state.agreementType}
              governingLaw={this.state.governingLaw}
              partyA={this.state.partyA}
              partyB={this.state.partyB}
              effectiveDate={this.state.effectiveDate}
              onGenerateDraft={this.generateDraft}
            />
          }

        </main>

      </div>
    );
  }
}