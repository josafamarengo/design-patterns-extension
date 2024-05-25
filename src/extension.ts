import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {


	let applySingletonCommand = vscode.commands.registerCommand(
    "gof-design-patterns-snippets-for-java.applySingleton",
    () => {
      analyzeAndApplyPattern(applySingletonPattern);
    }
  );

	let applyFactoryMethodCommand = vscode.commands.registerCommand(
    "gof-design-patterns-snippets-for-java.applyFactoryMethod",
    () => {
      analyzeAndApplyPattern(applyFactoryMethod);
    }
  );

  let applyBuilderCommand = vscode.commands.registerCommand(
    "gof-design-patterns-snippets-for-java.applyBuilder",
    () => {
      analyzeAndApplyPattern(applyBuilderPattern);
    }
  );

	context.subscriptions.push(applySingletonCommand);
  	context.subscriptions.push(applyFactoryMethodCommand);
	context.subscriptions.push(applyBuilderCommand);
}

function analyzeAndApplyPattern(
  applyPatternFunction: (
    document: vscode.TextDocument,
    className: string,
    attributes: string[],
    attributePositions: vscode.Position[]
  ) => vscode.TextEdit[]
) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage("No active editor found.");
    return;
  }

  const document = editor.document;
  const text = document.getText();
  const classPattern = /class\s+(\w+)/g;
  let match;

  while ((match = classPattern.exec(text)) !== null) {
    const className = match[1];
    vscode.window.showInformationMessage(`Class found: ${className}`);

    const attributePattern = /(?:private|protected|public)\s+(\w+)\s+(\w+);/g;
    let attributeMatch;
    let attributes: string[] = [];
    let attributePositions: vscode.Position[] = [];

    while ((attributeMatch = attributePattern.exec(text)) !== null) {
      const attributeType = attributeMatch[1];
      const attributeName = attributeMatch[2];
      attributes.push(`${attributeType} ${attributeName}`);
      attributePositions.push(
        document.positionAt(attributeMatch.index + attributeMatch[0].length)
      );
    }

    const edits = applyPatternFunction(
      document,
      className,
      attributes,
      attributePositions
    );
    if (edits.length > 0) {
      const edit = new vscode.WorkspaceEdit();
      edit.set(document.uri, edits);
      vscode.workspace.applyEdit(edit).then(() => {
        vscode.window.showInformationMessage(
          `Pattern applied to ${className}.`
        );
      });
    }
  }
}

function applySingletonPattern(
  document: vscode.TextDocument,
  className: string,
  attributes: string[],
  attributePositions: vscode.Position[]
): vscode.TextEdit[] {
  let edits: vscode.TextEdit[] = [];

  const singletonCode = `

    private static ${className} instance;

    private ${className}() {
        /* Inicialize Class */
    }

    public static ${className} getInstance() {
        if (instance == null) {
            instance = new ${className}();
        }
        return instance;
    }`;

  if (attributePositions.length > 0) {
    const lastAttributePosition =
      attributePositions[attributePositions.length - 1];
    edits.push(vscode.TextEdit.insert(lastAttributePosition, singletonCode));
  } else {
    const classStartPattern = /class\s+\w+\s*{/;
    const classStartMatch = classStartPattern.exec(document.getText());

    if (classStartMatch) {
      const classStartPosition = document.positionAt(
        classStartMatch.index + classStartMatch[0].length
      );
      edits.push(vscode.TextEdit.insert(classStartPosition, singletonCode));
    }
  }

  return edits;
}

function applyFactoryMethod(
  document: vscode.TextDocument,
  className: string,
  attributes: string[],
  attributePositions: vscode.Position[]
): vscode.TextEdit[] {
  let edits: vscode.TextEdit[] = [];

  const factoryMethodCode = `

    public static ${className} create${className}() {
        return new ${className}();
    }`;

  if (attributePositions.length > 0) {
    const lastAttributePosition =
      attributePositions[attributePositions.length - 1];
    edits.push(
      vscode.TextEdit.insert(lastAttributePosition, factoryMethodCode)
    );
  } else {
    const classStartPattern = /class\s+\w+\s*{/;
    const classStartMatch = classStartPattern.exec(document.getText());

    if (classStartMatch) {
      const classStartPosition = document.positionAt(
        classStartMatch.index + classStartMatch[0].length
      );
      edits.push(vscode.TextEdit.insert(classStartPosition, factoryMethodCode));
    }
  }

  return edits;
}

function applyBuilderPattern(
  document: vscode.TextDocument,
  className: string,
  attributes: string[],
  attributePositions: vscode.Position[]
): vscode.TextEdit[] {
  let edits: vscode.TextEdit[] = [];

  // Gerar métodos do Builder para cada atributo
  let builderMethods = attributes
    .map((attr) => {
      const [type, name] = attr.split(" ");
      const methodName = name.charAt(0).toUpperCase() + name.slice(1);
      return `
        public Builder ${name}(${type} ${name}) {
            this.${name} = ${name};
            return this;
        }`;
    })
    .join("\n");

  // Gerar inicializações de atributo no método build
  let buildInitializations = attributes
    .map((attr) => {
      const [type, name] = attr.split(" ");
      return `this.${name} = builder.${name};`;
    })
    .join("\n        ");

  // Gerar declaração dos atributos na Builder
  let builderAttributes = attributes
    .map((attr) => {
      return `private ${attr.split(" ")[0]} ${attr.split(" ")[1]};`;
    })
    .join("\n        ");

  const builderClassCode = `
  
    public static class Builder {
        ${builderAttributes}

        public Builder() {}

        ${builderMethods}

        public ${className} build() {
            return new ${className}(this);
        }
    }

    private ${className}(Builder builder) {
        ${buildInitializations}
    }

    public static Builder builder() {
        return new Builder();
    }`;

  // Inserir o código do Builder após a última declaração de atributo ou na posição adequada
  if (attributePositions.length > 0) {
    const lastAttributePosition =
      attributePositions[attributePositions.length - 1];
    edits.push(vscode.TextEdit.insert(lastAttributePosition, builderClassCode));
  } else {
    const classStartPattern = /class\s+\w+\s*{/;
    const classStartMatch = classStartPattern.exec(document.getText());

    if (classStartMatch) {
      const classStartPosition = document.positionAt(
        classStartMatch.index + classStartMatch[0].length
      );
      edits.push(vscode.TextEdit.insert(classStartPosition, builderClassCode));
    }
  }

  return edits;
}

export function deactivate() {}
