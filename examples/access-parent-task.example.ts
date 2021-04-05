import delay from 'delay'

/* eslint-disable @typescript-eslint/no-empty-function */
import { Listr } from '@root/index'
import { Logger } from '@utils/logger'

interface Ctx {
  skip: boolean
}

const logger = new Logger({ useIcons: false })

async function main (): Promise<void> {
  let task: Listr<Ctx>

  logger.start('Example for subtasks with different renderer options.')

  // eslint-disable-next-line prefer-const
  task = new Listr<Ctx>(
    [
      {
        title: 'This task will execute.',
        task: (_, task): Listr =>
          task.newListr(
            (parent) => [
              {
                title: 'This is a subtask.',
                task: async (): Promise<void> => {
                  await delay(3000)
                  parent.title = 'I am changing title from subtask.'
                }
              },
              {
                title: 'This is an another subtask.',
                task: async (): Promise<void> => {
                  await delay(2000)
                }
              }
            ],
            { concurrent: true }
          )
      },

      {
        title: 'This task will execute.',
        task: (_, task): Listr =>
          task.newListr(
            (parent) => [
              {
                title: 'This is a subtask.',
                task: async (): Promise<void> => {
                  await delay(3000)
                  parent.skip('This will skip the parent.')
                }
              },
              {
                title: 'This is an another subtask.',
                task: async (): Promise<void> => {
                  await delay(2000)
                }
              }
            ],
            { concurrent: true, rendererOptions: { collapse: false } }
          )
      }
    ],
    { concurrent: false }
  )

  try {
    const context = await task.run()
    logger.success(`Context: ${JSON.stringify(context)}`)
  } catch (e) {
    logger.fail(e)
  }
}

main()
