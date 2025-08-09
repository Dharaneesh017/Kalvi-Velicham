## GitHub Copilot Chat

- Extension Version: 0.29.1 (prod)
- VS Code: vscode/1.102.3
- OS: Windows

## Network

User Settings:

```json
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:

- DNS ipv4 Lookup: 20.207.73.85 (6 ms)
- DNS ipv6 Lookup: 64:ff9b::14cf:4955 (4 ms)
- Proxy URL: None (60 ms)
- Electron fetch (configured): HTTP 200 (75 ms)
- Node.js https: HTTP 200 (227 ms)
- Node.js fetch: HTTP 200 (502 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:

- DNS ipv4 Lookup: 140.82.113.22 (7 ms)
- DNS ipv6 Lookup: 64:ff9b::8c52:7116 (6 ms)
- Proxy URL: None (16 ms)
- Electron fetch (configured): HTTP 200 (386 ms)
- Node.js https: HTTP 200 (1436 ms)
- Node.js fetch: HTTP 200 (1322 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).
