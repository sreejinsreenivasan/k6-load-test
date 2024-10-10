import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 20 },
    { duration: "30s", target: 0 },
  ],
};

export default function () {
  const url = "http://172.17.0.1:8000/api/hello/";
  const response = http.get(url);

  check(response, {
    "is status 200": (r) => r.status === 200,
  });

  sleep(1);
}
