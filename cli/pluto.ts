#!/usr/bin/env ts-node
import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
// @ts-ignore
import gradient from 'gradient-string';

import { scanCommand }    from './commands/scan';
import { sandboxCommand } from './commands/sandbox';
import { alertsCommand }  from './commands/alerts';
import { trafficCommand } from './commands/traffic';
import { blockIpCommand } from './commands/block-ip';
import { sitesCommand }   from './commands/sites';
import { statsCommand }   from './commands/stats';

function banner() {
  const art = `
██████╗ ██╗     ██╗   ██╗████████╗ ██████╗ 
██╔══██╗██║     ██║   ██║╚══██╔══╝██╔═══██╗
██████╔╝██║     ██║   ██║   ██║   ██║   ██║
██╔═══╝ ██║     ██║   ██║   ██║   ██║   ██║
██║     ███████╗╚██████╔╝   ██║   ╚██████╔╝
╚═╝     ╚══════╝ ╚═════╝    ╚═╝    ╚═════╝ `;

  console.log(gradient(['#9B59B6', '#3498DB', '#00D4AA'])(art));
  console.log(
    boxen(
      chalk.cyanBright.bold('  PLUTO CLI  ') + '\n' +
      chalk.gray('  Autonomous Cyber Defense Agent'),
      {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        borderStyle: 'double',
        borderColor: 'cyan',
      }
    )
  );
  console.log();
}

const program = new Command();

program
  .name('pluto')
  .description('PLUTO — Autonomous Cyber Defense Agent CLI')
  .version('1.0.0')
  .hook('preAction', () => banner());

program
  .command('scan <url>')
  .description('Scan a website in the Playwright sandbox')
  .action(async (url: string) => {
    await scanCommand(url);
  });

program
  .command('sandbox <url>')
  .description('Run sandbox scan with full execution log')
  .action(async (url: string) => {
    await sandboxCommand(url);
  });

program
  .command('alerts')
  .description('Show active threat alerts')
  .option('-l, --limit <n>', 'Max alerts to show', '20')
  .action(async (opts: { limit: string }) => {
    await alertsCommand(parseInt(opts.limit));
  });

program
  .command('traffic')
  .description('Show live traffic stream')
  .option('-l, --limit <n>', 'Max entries to show', '30')
  .action(async (opts: { limit: string }) => {
    await trafficCommand(parseInt(opts.limit));
  });

program
  .command('block-ip <ip>')
  .description('Block an IP address via the response engine')
  .action(async (ip: string) => {
    await blockIpCommand(ip);
  });

program
  .command('sites')
  .description('Show recent sandbox-scanned sites')
  .action(async () => {
    await sitesCommand();
  });

program
  .command('stats')
  .description('Show system security status')
  .action(async () => {
    await statsCommand();
  });

// New agent commands
program
  .command('agent-run')
  .description('Run PLUTO agent cycle manually')
  .option('-t, --type <type>', 'Input type (traffic|sandbox|alert|manual)', 'manual')
  .option('-d, --data <data>', 'Input data (JSON string)')
  .action(async (opts: { type: string; data?: string }) => {
    const axios = require('axios');
    try {
      const inputData = opts.data ? JSON.parse(opts.data) : {};
      const response = await axios.post('http://localhost:3000/api/agent', {
        action: 'run_cycle',
        data: {
          type: opts.type,
          input: inputData,
          source: 'cli'
        }
      });
      
      if (response.data.success) {
        const result = response.data.agent_result;
        console.log(chalk.green('✓ PLUTO Agent Response:'));
        console.log(chalk.cyan(`  Threat: ${result.threat}`));
        console.log(chalk.yellow(`  Confidence: ${(result.confidence * 100).toFixed(1)}%`));
        console.log(chalk.blue(`  Action: ${result.action}`));
        console.log(chalk.gray(`  Reasoning: ${result.reasoning.join(', ')}`));
      } else {
        console.log(chalk.red('✗ Agent error:', response.data.message));
      }
    } catch (error) {
      console.log(chalk.red('✗ Failed to run agent:', error instanceof Error ? error.message : String(error)));
    }
  });

program
  .command('ask <question>')
  .description('Ask PLUTO a security question')
  .action(async (question: string) => {
    const axios = require('axios');
    try {
      const response = await axios.post('http://localhost:3000/api/agent', {
        action: 'ask_agent',
        data: { query: question }
      });
      
      if (response.data.success) {
        console.log(chalk.green('🤖 PLUTO:'), response.data.response);
        console.log(chalk.gray(`   Confidence: ${(response.data.confidence * 100).toFixed(1)}%`));
      } else {
        console.log(chalk.red('✗ PLUTO error:', response.data.message));
      }
    } catch (error) {
      console.log(chalk.red('✗ Failed to ask PLUTO:', error instanceof Error ? error.message : String(error)));
    }
  });

program.parse(process.argv);
