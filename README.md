

<h1 align="center">AskDev</h1>

<p align="center">
  This is a developer messaging dapp on the <strong>nOS</strong> platform with incentivisation. 
</p> 

<p align="center">
  <a href="https://github.com/nos/create-nos-dapp/releases">
    <img src="https://img.shields.io/github/tag/nos/create-nos-dapp.svg?style=flat">
  </a>
  <a href='https://github.com/prettier/prettier'>
    <img src='https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat'>
  </a>
</p>



## Setup
```bash
$ cd my-dapp-name
$ yarn start
```

Change `README.md` and `package.json` to fit your project needs. Delete `LICENSE` if not applicable.

## Testing
Use `yarn test:local` or `npm run test:local` to run all tests locally. The `test` command is reserved for CI builds.

## Document structure
```
react-stack-boilerplate
├── src
│   ├── __helpers__
│   ├── __mocks__
│   ├── assets
│   ├── components
│   │   ├── __tests__
│   │   ├── Header
│   │   ├── NOSActions
│   │   └── SpinningLogo
│   └── views
│       ├── __tests__
│       │   └── __snapshots__
│       └── App
├── .babelrc
├── .eslintignore
├── .eslintrc
├── .gitignore
├── .prettierrc
├── jest.config.js
├── jest.setup.js
├── LICENSE
├── logo.png
├── package.json
├── README.md
└── yarn.lock
```

## Known issues
 * Build assets to dedicated subdirectory https://github.com/parcel-bundler/parcel/issues/233
# askdev
