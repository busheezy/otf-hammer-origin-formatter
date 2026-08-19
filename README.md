# OTF Hammer Origin Formatter

Formats Hammer origin objects when they are pasted into `.vsndevts` files.

For example, pasting:

```text
{ origin = "115.447 414.053 96" }
```

inserts:

```text
[ 115.447, 414.053, 96 ]
```

The input must match that structure exactly, including its spaces and
punctuation. Coordinates may be negative and may contain a decimal fraction.
Surrounding whitespace, additional content, alternate spacing, leading `+`
signs, exponents, and other numeric formats are left unchanged.

## Development

```sh
pnpm install
pnpm run compile
```

Press `F5` in VS Code to launch an Extension Development Host.

## Releases

Pushing a `v*` tag packages the extension, publishes it to the Visual Studio
Marketplace using Microsoft Entra ID, and creates a GitHub release containing
the VSIX. The Entra identity must trust this GitHub repository through a
federated credential for the `marketplace` GitHub environment and must be a
Contributor for the `busheezy` Marketplace publisher. Store its client and
tenant IDs in the `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` Actions secrets for the
`marketplace` GitHub environment. These values identify the Entra workload and
do not contain a client secret. Run the `Get Marketplace identity ID` workflow
once to obtain the ID to add as a publisher member.
