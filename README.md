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

Pasted text that does not contain a valid origin object is left unchanged. The
formatter accepts any three finite numeric coordinate values and can format
multiple origin objects in the same paste.

## Development

```sh
pnpm install
pnpm run compile
```

Press `F5` in VS Code to launch an Extension Development Host.
