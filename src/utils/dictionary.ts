export const rulesMigrate = [
    //DELPHI
    { id: 'DELPHI_IF', pattern: /^IF\s+(.+)\s+THEN$/i },
    { id: 'DELPHI_WRITELN', pattern: /^Writeln\((.+)\);?$/i },
    { id: 'DELPHI_ASSIGN', pattern: /^([a-zA-Z0-9_]+)\s*:=\s*(.+?);?$/i },
    { id: 'DELPHI_BEGIN', pattern: /^begin$/i },
    { id: 'DELPHI_END', pattern: /^end;?$/i },

    //COBOL
    { id: 'IF', pattern: /^IF\s+(.+)$/i },
    { id: 'ELSE', pattern: /^ELSE$/i },
    { id: 'END_IF', pattern: /^END-IF$/i },
    { id: 'DISPLAY', pattern: /^DISPLAY\s+(.+)$/i },
    { id: 'MOVE', pattern: /^MOVE\s+(.+)\s+TO\s+(.+)$/i },
    { id: 'COMPUTE', pattern: /^COMPUTE\s+(.+)\s*=\s*(.+)$/i },
    { id: 'ADD', pattern: /^ADD\s+(.+)\s+TO\s+(.+)$/i },
    { id: 'SUBTRACT', pattern: /^SUBTRACT\s+(.+)\s+FROM\s+(.+)$/i },
    { id: 'MULTIPLY', pattern: /^MULTIPLY\s+(.+)\s+BY\s+(.+)$/i }
];

export abstract class BaseTranslator {
    translateIf(condition: string): string {
        return `if (${condition}) {`;
    }
    translateElse(): string {
        return `} else {`;
    }
    translateEndIf(): string {
        return `}`;
    }
    translateCompute(dest: string, operation: string): string {
        return `${dest} = ${operation};`;
    }
    translateAdd(val: string, dest: string): string {
        return `${dest} += ${val};`;
    }
    translateSubtract(val: string, dest: string): string {
        return `${dest} -= ${val};`;
    }
    translateMultiply(val: string, dest: string): string {
        return `${dest} *= ${val};`;
    }

    abstract translateDisplay(text: string): string;
    abstract translateMove(src: string, dest: string): string;
}

export class NodeTranslator extends BaseTranslator {
    translateDisplay(text: string): string { return `console.log(${text});`; }
    translateMove(src: string, dest: string): string { return `let ${dest} = ${src};`; }
}

export class JavaTranslator extends BaseTranslator {
    translateDisplay(text: string): string { return `System.out.println(${text});`; }
    translateMove(src: string, dest: string): string { return `var ${dest} = ${src};`; }
}

export class PythonTranslator extends BaseTranslator {
    translateIf(condition: string): string { return `if ${condition}:`; }
    translateElse(): string { return `else:`; }
    translateEndIf(): string { return `# fin del bloque`; }
    translateDisplay(text: string): string { return `print(${text})`; }
    translateMove(src: string, dest: string): string { return `${dest} = ${src}`; }
    translateCompute(dest: string, operation: string): string { return `${dest} = ${operation}`; }
    translateAdd(val: string, dest: string): string { return `${dest} += ${val}`; }
    translateSubtract(val: string, dest: string): string { return `${dest} -= ${val}`; }
    translateMultiply(val: string, dest: string): string { return `${dest} *= ${val}`; }
}

export class GoTranslator extends BaseTranslator {
    translateIf(condition: string): string { return `if ${condition} {`; }
    translateDisplay(text: string): string { return `fmt.Println(${text})`; }
    translateMove(src: string, dest: string): string { return `${dest} := ${src}`; }
    translateCompute(dest: string, operation: string): string { return `${dest} := ${operation}`; }
    translateAdd(val: string, dest: string): string { return `${dest} += ${val}`; }
    translateSubtract(val: string, dest: string): string { return `${dest} -= ${val}`; }
    translateMultiply(val: string, dest: string): string { return `${val} *= ${dest}`; }
}

export function getLanguage(language: string): BaseTranslator {
    switch (language) {
        case 'Java': return new JavaTranslator();
        case 'Python': return new PythonTranslator();
        case 'Go': return new GoTranslator();
        default: return new NodeTranslator();
    }
}