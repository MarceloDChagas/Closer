import { Name } from "../vo/Name";
import { Email } from "../vo/Email";
import { Phone } from "../vo/Phone";
import { Address } from "../vo/Address";
import { ClientId } from "../vo/ClientId";

export interface Client {
  id: ClientId;
  name: Name;
  email: Email;
  phone: Phone;
  address: Address;
} 