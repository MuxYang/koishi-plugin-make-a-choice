import { Context, Schema } from 'koishi';
export declare const name = "make-a-choice";
export interface Config {
    wakeWords: string[];
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context, config: Config): void;
