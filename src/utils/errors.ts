export class ApiError extends Error {
    public readonly statusCode: number = 500;
    public readonly errorMessage: string = 'Internal Server Error';
}

export class NotFound extends ApiError {
    public override readonly statusCode: number = 404;
    public override readonly errorMessage: string = 'Not Found';
}

export class BadRequest extends ApiError {
    public override readonly statusCode: number = 400;
    public override readonly errorMessage: string = 'Bad Request';
}
