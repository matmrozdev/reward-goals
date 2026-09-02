const suffix =
  new Date().getTime().toString(36) +
  '-' +
  Math.floor(Math.random() * 1_000_000).toString(36);
const email = 'maestro-' + suffix + '@example.test';
const password = E2E_PASSWORD;

output.auth = { email, password };

if (CREATE_VIA_API === 'true') {
  const response = http.post(API_URL + '/auth/register', {
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.status !== 201) {
    throw new Error(
      'Auth account setup failed with status ' +
        response.status +
        ': ' +
        response.body,
    );
  }
}
