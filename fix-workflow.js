const fs = require('fs')

const content = `name: Dispatch Daily Run

on:
  schedule:
    - cron: '0 5 * * *'
    - cron: '0 6 * * *'
  workflow_dispatch:

jobs:
  run-agent:
    name: Run Dispatch Agent
    runs-on: ubuntu-latest
    steps:
      - name: Trigger agent
        env:
          CRON_SECRET: \${{ secrets.CRON_SECRET }}
          APP_URL: \${{ secrets.APP_URL }}
        run: |
          curl -X GET \\
            -H "Authorization: Bearer $CRON_SECRET" \\
            --max-time 300 \\
            $APP_URL/api/cron/run

  send-email:
    name: Send Email Digest
    runs-on: ubuntu-latest
    steps:
      - name: Send digest
        env:
          CRON_SECRET: \${{ secrets.CRON_SECRET }}
          APP_URL: \${{ secrets.APP_URL }}
        run: |
          curl -X GET \\
            -H "Authorization: Bearer $CRON_SECRET" \\
            --max-time 120 \\
            $APP_URL/api/email
`

fs.writeFileSync('.github/workflows/dispatch.yml', content)
console.log('Done!')