import { CONFIG } from "~/config";

/** 
 * CONSOLE is a modification of the javascript built-in {@link console} module with the addition of checking ENV settings 
 * 
 * 
 * log will be displayed if env !- `production`
 * 
*/
export const CONSOLE = {
    log: function(message?: any, ...optionalParams: any[]): void {
        CONFIG.env != 'production' && console.log(message, ...optionalParams);
    },
    info: function (message?: any, ...optionalParams: any[]) {
        CONFIG.env != 'production' && console.info(message, ...optionalParams);
    },
    warn: function (message?: any, ...optionalParams: any[]) {
        CONFIG.env != 'production' && console.warn(message, ...optionalParams);
    },
    error: function (message?: any, ...optionalParams: any[]) {
        CONFIG.env != 'production' && console.error(message, ...optionalParams);
    },
    table: function (tabularData: any, properties?: readonly string[] | undefined): void{
        CONFIG.env != 'production' && console.table(tabularData, properties);
    }
}