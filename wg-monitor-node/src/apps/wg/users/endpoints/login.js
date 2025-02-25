const {router} = app.CreateApp();

const crypt = require('crypto-js');

router.get('/', (req, res) => {
  if (!req.session.user) {
    req.session.user = {
      authenticated: false,
    };

    res.json({
      detail: 'NotAuthenticated',
      authenticated: false
    })

    return;
  }

  const { authenticated } = req.session.user;
  res.json({ ...req.session.user,
    detail: authenticated ? 'Authenticated' : 'NotAuthenticated',
  });
});

router.post('/', async (req, res) => {
  const client = db.CreateClient()
  const {username, password} = req.body;
  const pw = crypt.SHA256(password).toString()

  console.log(password, ":", pw)
  const user = await client.user.findFirst({
    where: {
      username,
      password: pw
    }
  });

  const authenticated = !!user;

  req.session.user = {
    id: user?.id,
    authenticated,
    username,
    roles: user?.roles || [],
  }

  res.json({ ...req.session.user,
    detail: authenticated ? 'Authenticated' : 'Wrong-Credentials',
  });
});

module.exports = router;