import {createParamDecorator, ExecutionContext} from "@nestjs/common";


export const UserId = createParamDecorator((data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user?.id || "";
})