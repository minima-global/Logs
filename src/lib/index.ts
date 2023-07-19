import { LogsResponse } from '../types';

export function getLogs(): Promise<LogsResponse> {
  return new Promise((resolve, reject) => {
    (window as any).MDS.sql('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 500', function (response: any) {
      if (response.status) {
        return resolve(response.rows.reverse());
      }

      return reject();
    });
  });
}

export function set(key: string, value: string) {
  return new Promise((resolve, reject) => {
    (window as any).MDS.keypair.set(key, value, function (response: any) {
      if (response.status) {
        return resolve(response.response);
      }

      return reject();
    });
  });
}

export function get(key: string) {
  return new Promise((resolve) => {
    (window as any).MDS.keypair.get(key, function (response: any) {
      if (response.status) {
        return resolve(response.value);
      }

      return resolve('0');
    });
  });
}
