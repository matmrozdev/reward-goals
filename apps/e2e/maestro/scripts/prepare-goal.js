const loginResponse = http.post(API_URL + '/auth/login', {
  body: JSON.stringify({
    email: output.auth.email,
    password: output.auth.password,
  }),
  headers: { 'Content-Type': 'application/json' },
});

if (loginResponse.status !== 200) {
  throw new Error(
    'Goal setup login failed with status ' +
      loginResponse.status +
      ': ' +
      loginResponse.body,
  );
}

const loginBody = json(loginResponse.body);
const title = 'Maestro progress Goal';
const goalResponse = http.post(API_URL + '/goals', {
  body: JSON.stringify({ title, targetValue: 2 }),
  headers: {
    Authorization: 'Bearer ' + loginBody.accessToken,
    'Content-Type': 'application/json',
  },
});

if (goalResponse.status !== 201) {
  throw new Error(
    'Goal setup failed with status ' +
      goalResponse.status +
      ': ' +
      goalResponse.body,
  );
}

const goalBody = json(goalResponse.body);

output.goal = { id: goalBody.goal.id, title };
