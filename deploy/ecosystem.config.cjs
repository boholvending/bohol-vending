module.exports = {
  apps: [{
    name: "bohol-vending",
    script: "node_modules/next/dist/bin/next",
    args: "start -p 3000",
    cwd: "/home/boholvending/htdocs/boholvending.com",
    env: { NODE_ENV: "production", PORT: 3000 },
    instances: 1,
    exec_mode: "fork",
    max_memory_restart: "700M",
  }],
};
