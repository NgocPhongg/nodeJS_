"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapRequestHandler = void 0;
// type Func =(req: Request, res: Response, next: NextFunction) => Promise<void>
const wrapRequestHandler = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.wrapRequestHandler = wrapRequestHandler;
