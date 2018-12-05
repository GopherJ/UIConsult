## UIConsult

GL02 project@1.0

### System Dependencies

```bash
sudo apt install libcairo2-dev libjpeg-dev libgif-dev
```

### API

```
index.js 0.1.0

USAGE

  index.js <command> [options]

COMMANDS

  searchbycriteria <dir>             Email research per criteria
  freqemailuser <dir>                Access the frequency of a user’s sent emails on a period of time
  nbemailscolab <dir>                Display the number of emails sent from all the collaborators on a daily or a monthly basis
  loademails <dir>                   Load emails of specific period
  nbemails <dir> <employee>          Show an employee's exchanged emails' statistics of specific period
  busydays <dir> <employee>          Displays the list of the 10 days selected and the number of emails sent (outside working hours) for these days.
  topcontact <dir> <employee>        Show an employee's exchanged emails' statistics of specific period
  topwords <dir> <employee>          Displays the list of the 10 most used words in the emails subjects followed with the number and percentageof mail each word appears in
  exchangeplot <dir> <employee>      Have a visual representation of the employee interactions.
  help <command>                     Display help for a specific command

GLOBAL OPTIONS

  -h, --help         Display help
  -V, --version      Display version
  --no-color         Disable colors
  --quiet            Quiet mode - only displays warn and error messages
  -v, --verbose      Verbose mode - will also output debug messages
```

### Build && Compile && Test

`compile`

```bash
npm run build
# it will generate executables for linux, win and  macos. See the executable in ./bin
```

`cross-system compile`

```bash
TARGET_OS=win npm run build
TARGET_OS=linux npm run build
TARGET_OS=osx npm run build
```

`unit test`

```bash
npm run test
```



