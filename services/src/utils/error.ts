// TODO: Improve documentations

/**
 * Class used to redefined error instance with encoded error
 */
export class APIError extends Error {
    public code: number;
    public status: number;
    public errors: any;

    constructor(err: string, status: number, code: number) {
        super(err);
        this.name = err;
        this.status = status;
        this.code = code;
        this.errors = null;
    }

    public setErrors(errors: any) {
        this.errors = errors;
    }

    public toJSON() {
        return {
            code: this.code,
            status: this.status,
            errors: this.errors,
            name: this.name,
        };
    }
}
