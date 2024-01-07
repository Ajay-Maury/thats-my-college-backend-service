export class ResponseCallbackRequest {
  readonly useId: string;
  readonly createdAt: string;
  readonly deletedAt: string;
}

export class ResponseCallbackRequestDto {
  message: string;
  data?: ResponseCallbackRequest;
  isCallbackRequestExists?: boolean;
}
