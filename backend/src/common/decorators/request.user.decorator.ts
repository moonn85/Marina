import { createParamDecorator, ExecutionContext } from "@nestjs/common";
export class RequestUser {
  id: number;
  email: string;
  name: string;
  constructor(data: any) {
    Object.assign(this, data);
  }
}
export const User = createParamDecorator<unknown, ExecutionContext, RequestUser>(
  (_, ctx) => new RequestUser(ctx.switchToHttp().getRequest().user)
);
