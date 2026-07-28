import { HttpException, HttpStatus } from "@nestjs/common";

export class BaseHttpException extends HttpException {
  constructor(reason_code: string, status: HttpStatus) {
    super({ reason_code }, status);
  }
}

export class BadRequestError extends BaseHttpException {
  constructor(reason_code: string) {
    super(reason_code, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedError extends BaseHttpException {
  constructor(reason_code: string) {
    super(reason_code, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenError extends BaseHttpException {
  constructor(reason_code: string) {
    super(reason_code, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundError extends BaseHttpException {
  constructor(reason_code: string) {
    super(reason_code, HttpStatus.NOT_FOUND);
  }
}

export class ConflictError extends BaseHttpException {
  constructor(reason_code: string) {
    super(reason_code, HttpStatus.CONFLICT);
  }
}

export class InternalServerError extends BaseHttpException {
  constructor(reason_code: string) {
    super(reason_code, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
