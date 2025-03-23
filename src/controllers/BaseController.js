import { handleError } from "../utils/errors.js";

export class BaseController {
    async handleRequest(req, res, callback) {
        try {
            await callback(req, res);
        } catch (error) {
            handleError(error, res);
        }
    }
}
