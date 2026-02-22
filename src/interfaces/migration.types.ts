export interface MigrateReq {
    code: string;
    language: string;
}

export interface MigrateRes {
    orgLanguage: string;
    tarLanguage: string;
    result: string;
    report: Report;
}

export interface Report {
    totalRules: number;
    warnings: string[];
}