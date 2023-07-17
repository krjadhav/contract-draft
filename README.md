# Contract Drafter

Contract Drafter is an Office Word Add-in Task Pane project implemented using the React framework in TypeScript. It is designed to simplify the process of drafting contracts by leveraging a user-friendly interface and a range of features designed to streamline the document creation process. 

<img width="1432" alt="contract-draft" src="https://github.com/krjadhav/contract-draft/assets/14070843/80e7aa98-cc2a-4886-8660-fb9322ac6b6f">

## Features

- User authentication.
- Generation of legal contract draft.
- Integration with Word to input contract clauses.
- Management of contract library.
- Saving document content to the server.

## Requirements

Before starting, you will need:

- Node.js (the latest LTS version).
- The latest version of Yeoman and the Yeoman generator for Office Add-ins.

These can be installed via the Node.js download page and the Yeoman installation instructions, respectively.

## Getting Started

Follow these instructions to get the application running on your machine:

1. Clone the repository to your local machine.

2. Navigate to the root directory of the project.

3. Install the necessary dependencies by running the following command:

```bash
npm install
```

4. If you're testing your add-in on Mac, run the following command before proceeding. This starts the local web server:

```bash
npm run dev-server
```

5. To test your add-in in Word, run the following command. This will start the local web server (if it's not already running) and open Word with your add-in loaded:

```bash
npm start
```

With these steps, you should be able to run the Contract Drafter add-in on your local machine.
