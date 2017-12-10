import { Alerter } from "../src/providers/generic-alerter/generic-alerter";

export class GenericAlerterMock implements Alerter {
  public static title: String = null;
  public static message: String = null;

  present(title: string, message: string, buttons) {
    console.log('PRESENT', title, message);

    GenericAlerterMock.title = title;
    GenericAlerterMock.message = message;
  }

  presentError(message: string) {
    console.log('PRESENT ERROR', message);
  }
}