import { ClientId } from '../vo/ClientId';
import { Name } from '../vo/Name';
import { Email } from '../vo/Email';
import { Phone } from '../vo/Phone';
import { Address } from '../vo/Address';
export interface Client {
    id: ClientId;
    name: Name;
    email: Email;
    phone: Phone;
    address: Address;
}
