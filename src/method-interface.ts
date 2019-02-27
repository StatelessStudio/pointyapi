export type ResponderFunction = (result: any) => void;
export type ErrorHandlerFunction = (error: any, code?: number) => void;
export type LogHandlerFunction = (message: string, data?: any) => void;
