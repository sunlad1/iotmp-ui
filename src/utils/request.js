import Http from '@/plugs/http';
import hosts from '@/config/host';
import ENV from '@/config/env';


class Request extends Http {
  constructor(hostname) {
    super(hosts[ENV][hostname], ['10020018', '10020020', '10020019' ]);
  }
}

export default Request;