import { LogsResponse } from '../types';

export function getLogs(): Promise<LogsResponse> {
  return new Promise((resolve, reject) => {
    (window as any).MDS.sql('SELECT * FROM logs', function (response: any) {
      if (response.status) {
        return resolve(response.rows);
      }

      return reject();
    });
  });
}
