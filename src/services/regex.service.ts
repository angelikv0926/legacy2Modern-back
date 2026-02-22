import { rulesMigrate, getLanguage, BaseTranslator } from '../utils/dictionary';
import { MigrateRes } from '../interfaces/migration.types';

type action = (
    match: RegExpMatchArray,
    translator: BaseTranslator
) => string;

const ACTION_MAP: Record<string, action> = {
    'IF':             (m, t) => t.translateIf(m[1]),
    'DELPHI_IF':      (m, t) => t.translateIf(m[1]),
    'ELSE':           (m, t) => t.translateElse(),
    'END_IF':         (m, t) => t.translateEndIf(),
    'DELPHI_END':     (m, t) => t.translateEndIf(),
    'DISPLAY':        (m, t) => t.translateDisplay(m[1]),
    'DELPHI_WRITELN': (m, t) => t.translateDisplay(m[1].replace(/'/g, '"')),
    'COMPUTE':        (m, t) => t.translateCompute(m[1], m[2]),
    'DELPHI_ASSIGN':  (m, t) => t.translateCompute(m[1], m[2].replace(/'/g, '"')),
    'MOVE':           (m, t) => t.translateMove(m[1], m[2]),
    'ADD':            (m, t) => t.translateAdd(m[1], m[2]),
    'SUBTRACT':       (m, t) => t.translateSubtract(m[1], m[2]),
    'MULTIPLY':       (m, t) => t.translateMultiply(m[1], m[2]),
    'DELPHI_BEGIN':   ()     => ""
};

export function migrateCodeRegex(code: string, language: string): MigrateRes {
    const lines = code.split('\n');
    let migrateCode: string[] = [];
    let rules = 0; //Contador de reglas aplicadas
    let errors: string[] = []; //No migrados

    const languageToParse = getLanguage(language);

    lines.forEach((line, index) => {
        const matchInitialSpaces = line.match(/^\s*/);
        const spaces = matchInitialSpaces ? matchInitialSpaces[0] : "";
        let trimLine = line.trim();
        
        if (!trimLine) {
            migrateCode.push(line); 
            return;
        }
        trimLine = trimLine.replace(/[\.;]$/, '');
        let isTranslate = false;

        for (let rule of rulesMigrate) {
            const match = trimLine.match(rule.pattern);
            if (match) {
                const handler = ACTION_MAP[rule.id];
                
                if (handler) {
                    let translate = handler(match, languageToParse);
                    migrateCode.push(spaces + translate);
                    rules++;
                    isTranslate = true;
                }
                break; 
            }
        }

        if (!isTranslate) {
            const message = `Linea ${index + 1}: Regla no configurada para -> '${trimLine}'`;
            migrateCode.push(message);
            errors.push(message);
        }
    });

    return {
        orgLanguage: "COBOL/Delphi",
        tarLanguage: language,
        result: migrateCode.join('\n'),
        report: { totalRules: rules, warnings: errors }
    };
}