# Spy log

```
npm i spy-log
```

A simple log tool in bowsers

## Usage

```ts
import Log from 'spy-log'

async function subTask(logger) {
  logger.info('massage in suntask')
  await request('http://example.com', logger.group('getExample'))
  logger.end()
}

const logger = new Log('main')

logger.log('main start')
subTask(logger.group('subtask'))
```
