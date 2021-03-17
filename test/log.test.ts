import Log from '../src'

type MockLogRecord = {
  type: keyof Console
  data: any
}

describe('normal log', () => {
  let mockLogHistory: MockLogRecord[] = []
  beforeAll(() => {
    const mockConsole = <Console>{
      log(...data: any[]): void {
        mockLogHistory.push({ type: 'log', data })
      },
      warn(...data: any[]): void {
        mockLogHistory.push({ type: 'warn', data })
      },
      error(...data: any[]): void {
        mockLogHistory.push({ type: 'error', data })
      },
      group(...data: any[]): void {
        mockLogHistory.push({ type: 'group', data })
      },
      groupCollapsed(...data: any[]): void {
        mockLogHistory.push({ type: 'groupCollapsed', data })
      },
      groupEnd(...data: any[]): void {
        mockLogHistory.push({ type: 'groupEnd', data })
      },
    }
    Log.console = mockConsole
  })
  beforeEach(() => {
    mockLogHistory = []
  })
  test('log', () => {
    const logger = new Log('test namespace')
    logger.log('any text')
    expect(mockLogHistory).toEqual([{ type: 'log', data: ['[test namespace]', 'any text'] }])
  })
})