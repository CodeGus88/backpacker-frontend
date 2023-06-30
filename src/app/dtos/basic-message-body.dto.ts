import { EMessageType } from "../enums/e-message-type.enum";

export class BasicMessageBody{
    title: string = '';
    message: string = '';
    type: EMessageType = EMessageType.INFO;
}