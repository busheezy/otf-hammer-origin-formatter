import * as vscode from 'vscode';

const plainTextMimeType = 'text/plain';

const originPasteEditKind = vscode.DocumentDropOrPasteEditKind.Text.append(
    'otfHammerOrigin'
);

const coordinatePattern = '-?(?:0|[1-9]\\d*)(?:\\.\\d+)?';

const originPattern = new RegExp(
    `^\\{ origin = "(${coordinatePattern}) ` +
    `(${coordinatePattern}) (${coordinatePattern})" \\}$`
);

function formatOrigin(text: string): string | undefined
{
    const match = originPattern.exec(text);

    if (!match)
    {
        return undefined;
    }

    const x = match[1];
    const y = match[2];
    const z = match[3];

    const values = [x, y, z];

    return `[ ${values.join(', ')} ]`;
}

class OriginPasteEditProvider implements vscode.DocumentPasteEditProvider
{
    public async provideDocumentPasteEdits(
        document: vscode.TextDocument,
        ranges: readonly vscode.Range[],
        dataTransfer: vscode.DataTransfer,
        context: vscode.DocumentPasteEditContext,
        token: vscode.CancellationToken
    ): Promise<vscode.DocumentPasteEdit[] | undefined>
    {
        const clipboardItem = dataTransfer.get(plainTextMimeType);

        if (!clipboardItem)
        {
            return undefined;
        }

        const clipboardText = await clipboardItem.asString();

        if (token.isCancellationRequested)
        {
            return undefined;
        }

        const formattedText = formatOrigin(clipboardText);

        if (!formattedText)
        {
            return undefined;
        }

        const pasteEdit = new vscode.DocumentPasteEdit(
            formattedText,
            'Format Hammer origin',
            originPasteEditKind
        );

        return [pasteEdit];
    }
}

export function activate(context: vscode.ExtensionContext): void
{
    const documentSelector: vscode.DocumentSelector = {
        scheme: 'file',
        pattern: '**/*.vsndevts'
    };

    const provider = new OriginPasteEditProvider();

    const registration = vscode.languages.registerDocumentPasteEditProvider(
        documentSelector,
        provider,
        {
            providedPasteEditKinds: [originPasteEditKind],
            pasteMimeTypes: [plainTextMimeType]
        }
    );

    context.subscriptions.push(registration);
}

export function deactivate(): void
{
}
