import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

if (!process.stdin.isTTY) {
  console.error('请在服务器的交互式 SSH 终端运行此命令。');
  process.exit(1);
}

function hiddenInput(prompt) {
  return new Promise((resolve, reject) => {
    let value = '';
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    const receive = (chunk) => {
      for (const key of chunk.toString('utf8')) {
        if (key === '\u0003') {
          finish();
          reject(new Error('已取消'));
          return;
        } else if (key === '\r' || key === '\n') {
          process.stdout.write('\n');
          finish();
          resolve(value);
          return;
        } else if (key === '\u007f' || key === '\b') {
          value = value.slice(0, -1);
        } else if (!/[\u0000-\u001f]/.test(key)) {
          value += key;
        }
      }
    };
    const finish = () => {
      process.stdin.off('data', receive);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    };
    process.stdin.on('data', receive);
  });
}

const first = await hiddenInput('设置后台安全码（8–12 位，输入不显示）：');
const second = await hiddenInput('再次输入安全码：');
if (first.length < 8 || first.length > 12 || first !== second) {
  console.error('两次输入不一致，或安全码不是 8–12 位；未修改配置。');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const hash = pbkdf2Sync(first, Buffer.from(salt, 'hex'), 600000, 32, 'sha256').toString('hex');
const passwordHash = `pbkdf2-sha256:600000:${salt}:${hash}`;
const sessionSecret = randomBytes(32).toString('hex');
const directory = join(homedir(), '.config', 'bohol-vending');
const file = join(directory, 'admin.env');
await mkdir(directory, { recursive: true, mode: 0o700 });
await writeFile(file, `BOHOL_ADMIN_PASSWORD_HASH='${passwordHash}'\nBOHOL_ADMIN_SESSION_SECRET='${sessionSecret}'\n`, { mode: 0o600 });
const env = { ...process.env, BOHOL_ADMIN_PASSWORD_HASH: passwordHash, BOHOL_ADMIN_SESSION_SECRET: sessionSecret };
const restart = spawnSync('pm2', ['restart', 'bohol-vending', '--update-env'], { stdio: 'inherit', env });
if (restart.status !== 0) {
  console.error('安全码已保存；网站重启失败，请联系维护人员。');
  process.exit(1);
}
spawnSync('pm2', ['save'], { stdio: 'inherit', env });
console.log('后台安全码设置成功。请打开 https://boholvending.com/login 登录。');
