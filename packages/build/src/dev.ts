#!/usr/bin/env bun
import chalk from 'chalk'

const cwd = process.cwd()

const coreProcess = Bun.spawn(['bun', 'dev:core'], {
  cwd,
  stdout: 'inherit',
  onExit,
})

const webProcess = Bun.spawn(['bun', 'dev:web'], {
  cwd,
  stdout: 'inherit',
  onExit,
})

async function onExit() {
  if (!webProcess.killed) webProcess.kill()
  if (!coreProcess.killed) coreProcess.kill()
}

process.on('SIGINT', () => {
  onExit()
  console.log(chalk.gray('👋 Goodbye'))
})
