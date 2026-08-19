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
