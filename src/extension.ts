import * as vscode from 'vscode';

const plainTextMimeType = 'text/plain';

const originPasteEditKind = vscode.DocumentDropOrPasteEditKind.Text.append(
    'otfHammerOrigin'
);

const originPattern = /\{\s*origin\s*=\s*"([^"\r\n]+)"\s*\}/g;

function formatOrigins(text: string): string | undefined
{
    let didFormatOrigin = false;

    const formattedText = text.replace(
        originPattern,
        (match: string, coordinates: string) =>
        {
            const values = coordinates.trim().split(/\s+/);

            if (values.length !== 3)
            {
                return match;
            }

            const containsInvalidValue = values.some((value: string) =>
            {
                return !Number.isFinite(Number(value));
            });

            if (containsInvalidValue)
            {
                return match;
            }

            didFormatOrigin = true;

            return `[ ${values.join(', ')} ]`;
        }
    );

    if (!didFormatOrigin)
    {
        return undefined;
    }

    return formattedText;
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

        const formattedText = formatOrigins(clipboardText);

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
